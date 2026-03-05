import boto3
import json
import urllib.request

def handler(event, context):
    props = event['ResourceProperties']
    request_type = event['RequestType']

    if request_type == 'Delete':
        send_response(event, context, 'SUCCESS', {})
        return

    hosted_zone_id = props['HostedZoneId']
    domain = props['Domain']
    mode = props['Mode']
    max_age = props['MaxAge']
    bucket = props['BucketName']
    distribution_id = props['DistributionId']

    mx_hostnames = props.get('MxPatterns', [])
    if not mx_hostnames:
        # Query MX records and strip priority
        r53 = boto3.client('route53')
        response = r53.list_resource_record_sets(
            HostedZoneId=hosted_zone_id,
            StartRecordName=domain,
            StartRecordType='MX',
            MaxItems='10',
        )

        for rrset in response['ResourceRecordSets']:
            if rrset['Type'] == 'MX' and rrset['Name'].rstrip('.') == domain:
                for record in rrset['ResourceRecords']:
                    # Strip priority: "10 mail.example.com." -> "mail.example.com"
                    hostname = record['Value'].split(' ', 1)[1].rstrip('.')
                    mx_hostnames.append(hostname)

        if not mx_hostnames:
            raise Exception(f'No MX records found for {domain}')

    lines = ['version: STSv1', f'mode: {mode}', f'max_age: {max_age}']
    lines += [f'mx: {h}' for h in mx_hostnames]
    policy = '\n'.join(lines)

    # Upload to S3
    s3 = boto3.client('s3')
    s3.put_object(
        Bucket=bucket,
        Key='.well-known/mta-sts.txt',
        Body=policy,
        ContentType='text/plain',
    )

    # Invalidate CloudFront
    cf = boto3.client('cloudfront')
    cf.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
            'Paths': {'Quantity': 1, 'Items': ['/.well-known/mta-sts.txt']},
            'CallerReference': context.aws_request_id,
        },
    )

    send_response(event, context, 'SUCCESS', {'Policy': policy})


def send_response(event, context, status, data):
    body = json.dumps({
        'Status': status,
        'Reason': 'See CloudWatch logs',
        'PhysicalResourceId': event.get('PhysicalResourceId', context.log_stream_name),
        'StackId': event['StackId'],
        'RequestId': event['RequestId'],
        'LogicalResourceId': event['LogicalResourceId'],
        'Data': data,
    })
    req = urllib.request.Request(
        url=event['ResponseURL'],
        data=body.encode(),
        method='PUT',
        headers={'Content-Type': ''},
    )
    urllib.request.urlopen(req)
