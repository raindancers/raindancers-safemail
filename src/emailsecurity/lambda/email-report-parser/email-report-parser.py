import json
import gzip
import email
import boto3
import os
import urllib.request
from email import policy
from email.parser import BytesParser
from datetime import datetime
from typing import Dict, List, Any, Optional
import xml.etree.ElementTree as ET
from ipwhois import IPWhois

s3 = boto3.client('s3')
events = boto3.client('events')
ses = boto3.client('ses', region_name=os.environ.get('SES_REGION', 'ap-southeast-2'))
secretsmanager = boto3.client('secretsmanager')
bedrock = boto3.client('bedrock-runtime', region_name=os.environ.get('AWS_REGION', 'ap-southeast-2'))

_abuseipdb_key: Optional[str] = None

def get_abuseipdb_key() -> Optional[str]:
    """Fetch AbuseIPDB API key from Secrets Manager, cached for Lambda lifetime."""
    global _abuseipdb_key
    if _abuseipdb_key:
        return _abuseipdb_key
    secret_arn = os.environ.get('ABUSEIPDB_SECRET_ARN')
    if not secret_arn:
        return None
    try:
        response = secretsmanager.get_secret_value(SecretId=secret_arn)
        _abuseipdb_key = json.loads(response['SecretString'])['abuseIpDb']
        return _abuseipdb_key
    except Exception as e:
        print(f'Failed to retrieve AbuseIPDB key: {e}')
        return None

def enrich_ip(ip: str, whois_only: bool = False) -> Dict[str, Any]:
    """Enrich an IP address with AbuseIPDB and WHOIS/RDAP data. Pass whois_only=True to skip AbuseIPDB."""
    result: Dict[str, Any] = {}

    # AbuseIPDB lookup (only if secret ARN is configured and not whois_only)
    api_key = None if whois_only else get_abuseipdb_key()
    if api_key:
        try:
            req = urllib.request.Request(
                f'https://api.abuseipdb.com/api/v2/check?ipAddress={ip}&maxAgeInDays=90',
                headers={'Key': api_key, 'Accept': 'application/json'},
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())['data']
            result['abuseIpDb'] = {
                'hostnames': data.get('hostnames', []),
                'countryCode': data.get('countryCode'),
                'isp': data.get('isp'),
                'domain': data.get('domain'),
                'usageType': data.get('usageType'),
                'abuseConfidenceScore': data.get('abuseConfidenceScore', 0),
                'totalReports': data.get('totalReports', 0),
                'numDistinctUsers': data.get('numDistinctUsers', 0),
                'lastReportedAt': data.get('lastReportedAt'),
                'isTor': data.get('isTor', False),
            }
        except Exception as e:
            print(f'AbuseIPDB lookup failed for {ip}: {e}')

    # WHOIS/RDAP lookup (always, no API key required)
    try:
        whois = IPWhois(ip)
        rdap = whois.lookup_rdap(depth=1)
        network = rdap.get('network', {})
        asn_description = rdap.get('asn_description', '')
        abuse_emails = [
            obj.get('contact', {}).get('email', [{}])[0].get('value')
            for obj in rdap.get('objects', {}).values()
            if obj.get('roles') and 'abuse' in obj.get('roles', [])
        ]
        result['whois'] = {
            'asn': rdap.get('asn'),
            'asnDescription': asn_description,
            'networkCidr': network.get('cidr'),
            'networkName': network.get('name'),
            'networkCountry': network.get('country'),
            'abuseContact': next((e for e in abuse_emails if e), None),
        }
    except Exception as e:
        print(f'WHOIS lookup failed for {ip}: {e}')

    return result

def _explain_both_fail(domain: str, ip: str, count: int, disposition: str) -> str:
    action = 'rejected' if disposition == 'reject' else 'quarantined' if disposition == 'quarantine' else 'processed'
    return (
        f"{count} email(s) claiming to be from {domain} were sent from {ip} and {action}. "
        "Both DKIM and SPF failed — this IP is not authorised to send on behalf of your domain. "
        "This is consistent with domain spoofing or a completely misconfigured sender."
    )

def _explain_dkim_fail_only(domain: str, ip: str, count: int) -> str:
    return (
        f"{count} email(s) from {domain} via {ip}: SPF passed but DKIM failed. "
        "The email was sent from an authorised IP but the message signature was invalid or missing. "
        "This may indicate a misconfigured mail server, a missing DKIM key, or message tampering in transit."
    )

def _explain_spf_fail_only(domain: str, ip: str, count: int) -> str:
    return (
        f"{count} email(s) from {domain} via {ip}: DKIM passed but SPF failed. "
        "The message was signed correctly but sent from an IP not listed in your SPF record. "
        "This may indicate a legitimate sender whose IP is missing from your SPF record."
    )

def _explain_pass_with_quarantine(domain: str, ip: str, count: int, disposition: str) -> str:
    return (
        f"{count} email(s) from {domain} via {ip} passed DKIM and SPF but were {disposition}d by policy. "
        "Authentication passed — review your DMARC policy if this sender is legitimate."
    )

def generate_explanation(finding: Dict[str, Any]) -> str:
    """Generate a plain-English explanation of a DMARC failure."""
    record = finding.get('record', {})
    domain = finding.get('domain', 'unknown domain')
    ip = record.get('sourceIp', 'unknown IP')
    count = record.get('count', 0)
    dkim = record.get('dkimResult', 'fail')
    spf = record.get('spfResult', 'fail')
    disposition = record.get('disposition', 'none')

    if dkim != 'pass' and spf != 'pass':
        return _explain_both_fail(domain, ip, count, disposition)
    if dkim != 'pass':
        return _explain_dkim_fail_only(domain, ip, count)
    if spf != 'pass':
        return _explain_spf_fail_only(domain, ip, count)
    return _explain_pass_with_quarantine(domain, ip, count, disposition)

def _build_bedrock_prompt(finding: Dict[str, Any], explanation: str) -> str:
    record = finding.get('record', {})
    metadata = finding.get('reportMetadata', {})
    enrichment = finding.get('ipEnrichment', {})
    abuse = enrichment.get('abuseIpDb', {})
    whois = enrichment.get('whois', {})

    ip_section = ''
    if enrichment:
        hostnames = ', '.join(abuse.get('hostnames', [])) or 'none'
        ip_section = f"""IP INTELLIGENCE:
- Hostnames: {hostnames}
- Country: {abuse.get('countryCode', 'unknown')}
- ISP: {abuse.get('isp', 'unknown')}
- Usage type: {abuse.get('usageType', 'unknown')}
- Tor exit node: {abuse.get('isTor', False)}
- Abuse confidence score: {abuse.get('abuseConfidenceScore', 0)}/100
- Total abuse reports: {abuse.get('totalReports', 0)} from {abuse.get('numDistinctUsers', 0)} reporters
- Last reported: {abuse.get('lastReportedAt', 'never')}
- ASN: {whois.get('asn', 'unknown')} ({whois.get('asnDescription', 'unknown')})
- Network: {whois.get('networkCidr', 'unknown')} ({whois.get('networkName', 'unknown')})
"""

    dkim_details = ', '.join(
        f"{d['domain']} ({d['selector']}): {d['result']}" for d in record.get('dkimDetails', [])
    ) or 'none'
    spf_details = ', '.join(
        f"{d['domain']}: {d['result']}" for d in record.get('spfDetails', [])
    ) or 'none'

    return f"""Analyse this DMARC failure and provide a security assessment.

DOMAIN UNDER PROTECTION: {finding.get('domain', 'unknown')}
REPORT PERIOD: {metadata.get('dateBegin', 'unknown')} to {metadata.get('dateEnd', 'unknown')}
REPORTER: {metadata.get('orgName', 'unknown')}

FAILURE DETAILS:
- Source IP: {record.get('sourceIp', 'unknown')}
- Emails affected: {record.get('count', 0)}
- DKIM result: {record.get('dkimResult', 'unknown')}
- SPF result: {record.get('spfResult', 'unknown')}
- Disposition applied: {record.get('disposition', 'unknown')}
- DKIM signing domain(s): {dkim_details}
- SPF authorised domain(s): {spf_details}

{ip_section}
PRELIMINARY ASSESSMENT: {explanation}

Based on the above, provide your response in this exact format:

URGENCY: [CRITICAL|HIGH|MEDIUM|LOW]
IMPACT: [CRITICAL|HIGH|MEDIUM|LOW]
URGENCY_REASON: One sentence explaining the urgency rating.
IMPACT_REASON: One sentence explaining the impact rating.
CLASSIFICATION: [SPOOFING_ATTACK|MISCONFIGURED_SENDER|COMPROMISED_INFRASTRUCTURE|UNKNOWN]
THREAT_PROFILE: One sentence on likely threat actor.
RECOMMENDED_ACTION: One sentence on the most important immediate action."""

_BEDROCK_SYSTEM_PROMPT = (
    'You are a senior email security analyst. You analyse DMARC aggregate reports to identify '
    'domain spoofing, phishing infrastructure, and misconfigured legitimate senders. '
    'You are precise, concise, and actionable. You do not speculate beyond the evidence provided.'
)

def generate_bedrock_narrative(finding: Dict[str, Any], explanation: str) -> Optional[Dict[str, str]]:
    """Call Bedrock converse API and return parsed structured assessment, or None on failure."""
    model_id = os.environ.get('BEDROCK_MODEL_ID')
    if not model_id:
        return None
    try:
        response = bedrock.converse(
            modelId=model_id,
            system=[{'text': _BEDROCK_SYSTEM_PROMPT}],
            messages=[{'role': 'user', 'content': [{'text': _build_bedrock_prompt(finding, explanation)}]}],
            inferenceConfig={'maxTokens': 512, 'temperature': 0.1},
        )
        text = response['output']['message']['content'][0]['text']
        result: Dict[str, str] = {}
        for line in text.strip().splitlines():
            if ':' in line:
                key, _, value = line.partition(':')
                result[key.strip()] = value.strip()
        return result if result else None
    except Exception as e:
        print(f'Bedrock narrative generation failed: {e}')
        return None

def _build_tlsrpt_bedrock_prompt(finding: Dict[str, Any]) -> str:
    metadata = finding.get('reportMetadata', {})
    policy = finding.get('policy', {})
    summary = finding.get('summary', {})
    failures = finding.get('failureDetails', [])

    failure_lines = '\n'.join(
        f"- {f.get('resultType')}: {f.get('failedSessionCount')} session(s) from {f.get('sendingMtaIp')} to {f.get('receivingMxHostname')}"
        for f in failures
    ) or 'None reported'

    return f"""Analyse this TLS-RPT failure and provide a security assessment.

DOMAIN UNDER PROTECTION: {policy.get('domain', 'unknown')}
POLICY TYPE: {policy.get('type', 'unknown')}
REPORT PERIOD: {metadata.get('dateBegin', 'unknown')} to {metadata.get('dateEnd', 'unknown')}
REPORTER: {metadata.get('orgName', 'unknown')}

SESSION SUMMARY:
- Successful sessions: {summary.get('totalSuccessful', 0)}
- Failed sessions: {summary.get('totalFailed', 0)}

FAILURE DETAILS:
{failure_lines}

Based on the above, provide your response in this exact format:

URGENCY: [CRITICAL|HIGH|MEDIUM|LOW]
IMPACT: [CRITICAL|HIGH|MEDIUM|LOW]
URGENCY_REASON: One sentence explaining the urgency rating.
IMPACT_REASON: One sentence explaining the impact rating.
CLASSIFICATION: [CERTIFICATE_ISSUE|MTA_STS_POLICY_FAILURE|STARTTLS_NOT_SUPPORTED|DANE_FAILURE|UNKNOWN]
THREAT_PROFILE: One sentence on the likely cause.
RECOMMENDED_ACTION: One sentence on the most important immediate action."""

def generate_tlsrpt_narrative(finding: Dict[str, Any]) -> Optional[Dict[str, str]]:
    """Call Bedrock converse API for a TLS-RPT finding, or None on failure."""
    model_id = os.environ.get('BEDROCK_MODEL_ID')
    if not model_id:
        return None
    try:
        response = bedrock.converse(
            modelId=model_id,
            system=[{'text': _BEDROCK_SYSTEM_PROMPT}],
            messages=[{'role': 'user', 'content': [{'text': _build_tlsrpt_bedrock_prompt(finding)}]}],
            inferenceConfig={'maxTokens': 512, 'temperature': 0.1},
        )
        text = response['output']['message']['content'][0]['text']
        result: Dict[str, str] = {}
        for line in text.strip().splitlines():
            if ':' in line:
                key, _, value = line.partition(':')
                result[key.strip()] = value.strip()
        return result if result else None
    except Exception as e:
        print(f'Bedrock TLS-RPT narrative generation failed: {e}')
        return None

def handler(event, context):
    """Parse DMARC and TLS-RPT emails from S3 and publish findings to EventBridge"""
    
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Download email from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        email_content = response['Body'].read()
        
        # Parse email
        msg = BytesParser(policy=policy.default).parsebytes(email_content)
        
        # Extract attachments and parse
        findings = []
        for part in msg.walk():
            if part.get_content_disposition() == 'attachment':
                filename = part.get_filename()
                content = part.get_payload(decode=True)
                
                # Handle gzip compressed attachments
                if filename and filename.endswith('.gz'):
                    content = gzip.decompress(content)
                    filename = filename[:-3]
                
                # Parse based on report type
                if 'dmarc' in filename.lower() or filename.endswith('.xml'):
                    findings.extend(parse_dmarc_report(content, msg))
                elif 'tlsrpt' in filename.lower() or filename.endswith('.json'):
                    findings.extend(parse_tlsrpt_report(content, msg))
        
        # Publish findings to EventBridge
        for finding in findings:
            publish_to_eventbridge(finding)
            
            # Send email alert for failures
            if finding.get('isFailure'):
                send_email_alert(finding)
        
        # Store parsed reports in S3
        if findings:
            store_parsed_reports(bucket, key, findings)
    
    return {'statusCode': 200, 'body': json.dumps(f'Processed {len(findings)} findings')}

def parse_dmarc_report(content: bytes, msg: email.message.Message) -> List[Dict[str, Any]]:
    """Parse DMARC aggregate report XML"""
    findings = []
    
    try:
        root = ET.fromstring(content)
        
        # Extract report metadata
        report_metadata = root.find('report_metadata')
        org_name = report_metadata.find('org_name').text if report_metadata.find('org_name') is not None else 'Unknown'
        report_id = report_metadata.find('report_id').text if report_metadata.find('report_id') is not None else 'Unknown'
        date_begin = report_metadata.find('date_range/begin').text if report_metadata.find('date_range/begin') is not None else None
        date_end = report_metadata.find('date_range/end').text if report_metadata.find('date_range/end') is not None else None
        
        # Extract policy
        policy_published = root.find('policy_published')
        domain = policy_published.find('domain').text if policy_published.find('domain') is not None else 'Unknown'
        dmarc_policy = policy_published.find('p').text if policy_published.find('p') is not None else 'none'
        
        # Parse records
        for record in root.findall('record'):
            row = record.find('row')
            source_ip = row.find('source_ip').text if row.find('source_ip') is not None else 'Unknown'
            count = int(row.find('count').text) if row.find('count') is not None else 0
            
            policy_evaluated = row.find('policy_evaluated')
            disposition = policy_evaluated.find('disposition').text if policy_evaluated.find('disposition') is not None else 'none'
            dkim_result = policy_evaluated.find('dkim').text if policy_evaluated.find('dkim') is not None else 'fail'
            spf_result = policy_evaluated.find('spf').text if policy_evaluated.find('spf') is not None else 'fail'
            
            # Extract auth results
            auth_results = record.find('auth_results')
            dkim_details = []
            spf_details = []
            
            if auth_results is not None:
                for dkim in auth_results.findall('dkim'):
                    dkim_domain = dkim.find('domain').text if dkim.find('domain') is not None else 'Unknown'
                    dkim_selector = dkim.find('selector').text if dkim.find('selector') is not None else 'Unknown'
                    dkim_auth_result = dkim.find('result').text if dkim.find('result') is not None else 'fail'
                    dkim_details.append({
                        'domain': dkim_domain,
                        'selector': dkim_selector,
                        'result': dkim_auth_result
                    })
                
                for spf in auth_results.findall('spf'):
                    spf_domain = spf.find('domain').text if spf.find('domain') is not None else 'Unknown'
                    spf_auth_result = spf.find('result').text if spf.find('result') is not None else 'fail'
                    spf_details.append({
                        'domain': spf_domain,
                        'result': spf_auth_result
                    })
            
            # Determine if this is a failure
            is_failure = (dkim_result != 'pass' or spf_result != 'pass' or disposition in ['quarantine', 'reject'])
            
            finding = {
                'reportType': 'DMARC',
                'timestamp': datetime.utcnow().isoformat(),
                'severity': 'HIGH' if is_failure else 'INFO',
                'domain': domain,
                'reportMetadata': {
                    'orgName': org_name,
                    'reportId': report_id,
                    'dateBegin': date_begin,
                    'dateEnd': date_end
                },
                'record': {
                    'sourceIp': source_ip,
                    'count': count,
                    'disposition': disposition,
                    'dkimResult': dkim_result,
                    'spfResult': spf_result,
                    'dkimDetails': dkim_details,
                    'spfDetails': spf_details
                },
                'ipEnrichment': enrich_ip(source_ip) if is_failure else {},
                'explanation': None,
                'isFailure': is_failure,
                'policy': dmarc_policy
            }

            if is_failure:
                finding['explanation'] = generate_explanation(finding)

            findings.append(finding)
    
    except Exception as e:
        print(f"Error parsing DMARC report: {str(e)}")
        findings.append({
            'reportType': 'DMARC',
            'timestamp': datetime.utcnow().isoformat(),
            'severity': 'ERROR',
            'error': str(e),
            'isFailure': True
        })
    
    return findings

def parse_tlsrpt_report(content: bytes, msg: email.message.Message) -> List[Dict[str, Any]]:
    """Parse TLS-RPT JSON report"""
    findings = []
    
    try:
        report = json.loads(content.decode('utf-8'))
        
        org_name = report.get('organization-name', 'Unknown')
        date_begin = report.get('date-range', {}).get('start-datetime', 'Unknown')
        date_end = report.get('date-range', {}).get('end-datetime', 'Unknown')
        contact_info = report.get('contact-info', 'Unknown')
        
        for policy in report.get('policies', []):
            policy_type = policy.get('policy', {}).get('policy-type', 'Unknown')
            policy_domain = policy.get('policy', {}).get('policy-domain', 'Unknown')
            
            total_successful = policy.get('summary', {}).get('total-successful-session-count', 0)
            total_failed = policy.get('summary', {}).get('total-failure-session-count', 0)
            
            # Parse failure details
            failure_details = []
            for failure in policy.get('failure-details', []):
                result_type = failure.get('result-type', 'Unknown')
                sending_mta_ip = failure.get('sending-mta-ip', 'Unknown')
                receiving_mx_hostname = failure.get('receiving-mx-hostname', 'Unknown')
                failed_session_count = failure.get('failed-session-count', 0)
                
                failure_details.append({
                    'resultType': result_type,
                    'sendingMtaIp': sending_mta_ip,
                    'receivingMxHostname': receiving_mx_hostname,
                    'failedSessionCount': failed_session_count,
                    'ipEnrichment': enrich_ip(sending_mta_ip, whois_only=True) if total_failed > 0 and sending_mta_ip != 'Unknown' else {},
                })
            
            is_failure = total_failed > 0
            
            finding = {
                'reportType': 'TLS-RPT',
                'timestamp': datetime.utcnow().isoformat(),
                'severity': 'HIGH' if is_failure else 'INFO',
                'reportMetadata': {
                    'orgName': org_name,
                    'dateBegin': date_begin,
                    'dateEnd': date_end,
                    'contactInfo': contact_info
                },
                'policy': {
                    'type': policy_type,
                    'domain': policy_domain
                },
                'summary': {
                    'totalSuccessful': total_successful,
                    'totalFailed': total_failed
                },
                'failureDetails': failure_details,
                'isFailure': is_failure
            }
            
            findings.append(finding)
    
    except Exception as e:
        print(f"Error parsing TLS-RPT report: {str(e)}")
        findings.append({
            'reportType': 'TLS-RPT',
            'timestamp': datetime.utcnow().isoformat(),
            'severity': 'ERROR',
            'error': str(e),
            'isFailure': True
        })
    
    return findings

def publish_to_eventbridge(finding: Dict[str, Any]):
    """Publish finding to EventBridge"""
    try:
        events.put_events(
            Entries=[{
                'Source': 'email.security.reports',
                'DetailType': f'Email Security Report - {finding["reportType"]}',
                'Detail': json.dumps(finding),
                'EventBusName': os.environ.get('EVENT_BUS_NAME', 'default')
            }]
        )
    except Exception as e:
        print(f"Error publishing to EventBridge: {str(e)}")

def store_parsed_reports(bucket: str, original_key: str, findings: List[Dict[str, Any]]):
    """Store parsed reports back to S3"""
    try:
        parsed_key = original_key.replace('raw/', 'parsed/').replace('.eml', '.json')
        s3.put_object(
            Bucket=bucket,
            Key=parsed_key,
            Body=json.dumps(findings, indent=2),
            ContentType='application/json'
        )
    except Exception as e:
        print(f"Error storing parsed reports: {str(e)}")

def send_email_alert(finding: Dict[str, Any]):
    """Send formatted HTML email alert via SES"""
    try:
        alert_email = os.environ.get('ALERT_EMAIL')
        report_domain = os.environ.get('REPORT_DOMAIN')
        
        if not alert_email or not report_domain:
            print("Missing ALERT_EMAIL or REPORT_DOMAIN environment variables")
            return
        
        subject = f"🚨 Email Security Alert - {finding['reportType']} Failure"

        explanation = finding.get('explanation')
        narrative = generate_bedrock_narrative(finding, explanation) if explanation else generate_tlsrpt_narrative(finding) if finding.get('reportType') == 'TLS-RPT' else None

        html_body = generate_html_email(finding, narrative)
        text_body = generate_text_email(finding)
        
        ses.send_email(
            Source=f"Email Security Alerts <alerts@{report_domain}>",
            Destination={'ToAddresses': [alert_email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'},
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'}
                }
            }
        )
        print(f"Sent email alert for {finding['reportType']} failure")
    except Exception as e:
        print(f"Error sending email alert: {str(e)}")

def generate_html_email(finding: Dict[str, Any], narrative: Optional[Dict[str, str]] = None) -> str:
    """Generate HTML formatted email"""
    report_type = finding.get('reportType', 'Unknown')
    severity = finding.get('severity', 'UNKNOWN')
    timestamp = finding.get('timestamp', 'Unknown')
    domain = finding.get('domain') or (finding.get('policy', {}).get('domain', '') if isinstance(finding.get('policy'), dict) else '')
    
    severity_color = {
        'HIGH': '#dc3545',
        'MEDIUM': '#ffc107',
        'LOW': '#17a2b8',
        'INFO': '#6c757d',
        'ERROR': '#dc3545'
    }.get(severity, '#6c757d')
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: {severity_color}; color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
            .content {{ background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }}
            .severity {{ display: inline-block; padding: 5px 10px; border-radius: 3px; background-color: {severity_color}; color: white; font-weight: bold; }}
            table {{ width: 100%; border-collapse: collapse; margin: 15px 0; background-color: white; }}
            th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
            th {{ background-color: #e9ecef; font-weight: bold; }}
            .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #6c757d; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 {report_type} Failure — {domain}</h1>
                <p>A security issue has been detected in your email authentication reports</p>
            </div>
            <div class="content">
                <p><strong>Report Type:</strong> {report_type}</p>
                <p><strong>Severity:</strong> <span class="severity">{severity}</span></p>
                <p><strong>Timestamp:</strong> {timestamp}</p>
    """
    
    if report_type == 'DMARC':
        html += generate_dmarc_details(finding, narrative)
    elif report_type == 'TLS-RPT':
        html += generate_tlsrpt_details(finding, narrative)
    
    model_name = os.environ.get('BEDROCK_MODEL_NAME', '')
    if narrative and model_name:
        footer_text = f'This report has been enriched by sending the data to {model_name} AI LLM. Verify its validity and make sure it\'s sensible before taking action.'
    else:
        footer_text = 'This is an automated alert from your Email Security Monitoring System. Please review the details above and take appropriate action.'

    html += f"""
                <div class="footer">
                    <p>{footer_text}</p>
                    <p>Generated by safemail by raindancers.cloud &mdash; github.com/raindancers-cdk</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    return html

def generate_dmarc_details(finding: Dict[str, Any], narrative: Optional[Dict[str, str]] = None) -> str:
    """Generate DMARC-specific HTML details including explanation, narrative banner, and IP intelligence."""
    record = finding.get('record', {})
    metadata = finding.get('reportMetadata', {})
    enrichment = finding.get('ipEnrichment', {})
    abuse = enrichment.get('abuseIpDb', {})
    whois = enrichment.get('whois', {})
    explanation = finding.get('explanation', '')

    def fmt_ts(ts: Optional[str]) -> str:
        if not ts:
            return 'Unknown'
        try:
            return datetime.utcfromtimestamp(int(ts)).strftime('%d %b %Y %H:%M UTC')
        except Exception:
            return ts

    html = ''

    # Analyst assessment banner (Bedrock)
    if narrative:
        urgency = narrative.get('URGENCY', '')
        impact = narrative.get('IMPACT', '')
        classification = narrative.get('CLASSIFICATION', '').replace('_', ' ').title()
        banner_color = {'CRITICAL': '#dc3545', 'HIGH': '#e67e22', 'MEDIUM': '#f39c12', 'LOW': '#17a2b8'}.get(urgency, '#6c757d')
        html += f"""
        <div style="border:2px solid {banner_color};border-radius:5px;padding:15px;margin:15px 0;background:#fff">
            <table style="width:100%;border:none;margin:0"><tr>
                <td style="border:none;padding:4px"><strong>URGENCY:</strong> <span style="color:{banner_color}">{urgency}</span></td>
                <td style="border:none;padding:4px"><strong>IMPACT:</strong> <span style="color:{banner_color}">{impact}</span></td>
                <td style="border:none;padding:4px"><strong>Classification:</strong> {classification}</td>
            </tr></table>
            <p style="margin:8px 0 4px 0"><strong>Threat profile:</strong> {narrative.get('THREAT_PROFILE', '')}</p>
            <p style="margin:4px 0"><strong>Recommended action:</strong> {narrative.get('RECOMMENDED_ACTION', '')}</p>
        </div>
        """

    # What happened
    if explanation:
        html += f'<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px;margin:15px 0"><strong>What happened:</strong> {explanation}</div>'

    # Core DMARC table
    html += f"""
        <h3>DMARC Report Details</h3>
        <table>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Domain</td><td>{finding.get('domain', 'Unknown')}</td></tr>
            <tr><td>Source IP</td><td>{record.get('sourceIp', 'Unknown')}</td></tr>
            <tr><td>Emails affected</td><td>{record.get('count', 0)}</td></tr>
            <tr><td>DKIM Result</td><td>{record.get('dkimResult', 'Unknown')}</td></tr>
            <tr><td>SPF Result</td><td>{record.get('spfResult', 'Unknown')}</td></tr>
            <tr><td>Disposition</td><td>{record.get('disposition', 'Unknown')}</td></tr>
            <tr><td>Reporter</td><td>{metadata.get('orgName', 'Unknown')}</td></tr>
            <tr><td>Report period</td><td>{fmt_ts(metadata.get('dateBegin'))} &ndash; {fmt_ts(metadata.get('dateEnd'))}</td></tr>
        </table>
    """

    # IP Intelligence table
    if enrichment:
        hostnames = ', '.join(abuse.get('hostnames', [])) or 'none'
        tor_flag = ' ⚠️ Tor exit node' if abuse.get('isTor') else ''
        html += f"""
        <h3>IP Intelligence</h3>
        <table>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Hostnames (PTR)</td><td>{hostnames}</td></tr>
            <tr><td>Country</td><td>{abuse.get('countryCode', 'Unknown')}</td></tr>
            <tr><td>ISP</td><td>{abuse.get('isp', 'Unknown')}</td></tr>
            <tr><td>Usage type</td><td>{abuse.get('usageType', 'Unknown')}{tor_flag}</td></tr>
            <tr><td>Abuse score</td><td>{abuse.get('abuseConfidenceScore', 0)}/100 ({abuse.get('totalReports', 0)} reports from {abuse.get('numDistinctUsers', 0)} reporters)</td></tr>
            <tr><td>Last reported</td><td>{abuse.get('lastReportedAt') or 'Never'}</td></tr>
            <tr><td>ASN</td><td>{whois.get('asn', 'Unknown')} &mdash; {whois.get('asnDescription', 'Unknown')}</td></tr>
            <tr><td>Network</td><td>{whois.get('networkCidr', 'Unknown')} ({whois.get('networkName', 'Unknown')})</td></tr>
        </table>
        """

    return html

def generate_tlsrpt_details(finding: Dict[str, Any], narrative: Optional[Dict[str, str]] = None) -> str:
    """Generate TLS-RPT-specific HTML details"""
    policy = finding.get('policy', {})
    summary = finding.get('summary', {})
    metadata = finding.get('reportMetadata', {})

    html = ''

    if narrative:
        urgency = narrative.get('URGENCY', '')
        impact = narrative.get('IMPACT', '')
        classification = narrative.get('CLASSIFICATION', '').replace('_', ' ').title()
        banner_color = {'CRITICAL': '#dc3545', 'HIGH': '#e67e22', 'MEDIUM': '#f39c12', 'LOW': '#17a2b8'}.get(urgency, '#6c757d')
        html += f"""
        <div style="border:2px solid {banner_color};border-radius:5px;padding:15px;margin:15px 0;background:#fff">
            <table style="width:100%;border:none;margin:0"><tr>
                <td style="border:none;padding:4px"><strong>URGENCY:</strong> <span style="color:{banner_color}">{urgency}</span></td>
                <td style="border:none;padding:4px"><strong>IMPACT:</strong> <span style="color:{banner_color}">{impact}</span></td>
                <td style="border:none;padding:4px"><strong>Classification:</strong> {classification}</td>
            </tr></table>
            <p style="margin:8px 0 4px 0"><strong>Likely cause:</strong> {narrative.get('THREAT_PROFILE', '')}</p>
            <p style="margin:4px 0"><strong>Recommended action:</strong> {narrative.get('RECOMMENDED_ACTION', '')}</p>
        </div>
        """

    html += f"""
        <h3>TLS-RPT Report Details</h3>
        <table>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Policy Type</td><td>{policy.get('type', 'Unknown')}</td></tr>
            <tr><td>Policy Domain</td><td>{policy.get('domain', 'Unknown')}</td></tr>
            <tr><td>Successful Sessions</td><td>{summary.get('totalSuccessful', 0)}</td></tr>
            <tr><td>Failed Sessions</td><td>{summary.get('totalFailed', 0)}</td></tr>
            <tr><td>Reporter</td><td>{metadata.get('orgName', 'Unknown')}</td></tr>
        </table>
    """
    
    failure_details = finding.get('failureDetails', [])
    if failure_details:
        html += "<h4>Failure Details</h4><table><tr><th>Result Type</th><th>Sending MTA IP</th><th>ISP / ASN</th><th>Receiving MX</th><th>Failed Count</th></tr>"
        for failure in failure_details:
            whois = failure.get('ipEnrichment', {}).get('whois', {})
            isp_asn = f"{whois.get('asnDescription', '')} ({whois.get('networkCidr', '')})" if whois else 'Unknown'
            html += f"""
                <tr>
                    <td>{failure.get('resultType', 'Unknown')}</td>
                    <td>{failure.get('sendingMtaIp', 'Unknown')}</td>
                    <td>{isp_asn}</td>
                    <td>{failure.get('receivingMxHostname', 'Unknown')}</td>
                    <td>{failure.get('failedSessionCount', 0)}</td>
                </tr>
            """
        html += "</table>"
    
    return html

def generate_text_email(finding: Dict[str, Any]) -> str:
    """Generate plain text email as fallback"""
    return f"""
Email Security Alert

Report Type: {finding.get('reportType', 'Unknown')}
Severity: {finding.get('severity', 'Unknown')}
Timestamp: {finding.get('timestamp', 'Unknown')}
Domain: {finding.get('domain', 'Unknown')}

Details:
{json.dumps(finding, indent=2)}

This is an automated alert from your Email Security Monitoring System.
    """
