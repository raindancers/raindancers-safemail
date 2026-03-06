# raindancers-safemail

AWS CDK constructs for email security and compliance. Simplifies deployment of SPF, DKIM, DMARC, MTA-STS, and TLS-RPT records with automated reporting and alerting.

## Features

- **Email Security Records**: Deploy SPF, DKIM, DMARC, MTA-STS, and TLS-RPT DNS records
- **Automated Reporting**: Receive and parse DMARC and TLS-RPT reports via SES
- **AI-Powered Analysis**: Optional Amazon Bedrock integration for intelligent report summaries
- **IP Enrichment**: Optional AbuseIPDB integration for threat intelligence
- **Alert Notifications**: HTML email alerts for security failures

## Installation

```bash
npm install raindancers-safemail
```

## Quick Start

```typescript
import { EmailSecurity, SpfInclude, SpfQualifier, DmarcPolicy, MtaStsMode } from 'raindancers-safemail';

const emailSec = new EmailSecurity(this, 'EmailSecurity', { 
  hostedZone: hostedZone 
});

// Add SPF record
emailSec.addSpf({ 
  include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES], 
  all: SpfQualifier.FAIL 
});

// Add DKIM records (auto-fetch from SES)
emailSec.addSesDkimFromIdentity();

// Add DMARC record
emailSec.addDmarc({ 
  policy: DmarcPolicy.REJECT, 
  percentage: 100 
});

// Add MTA-STS policy
emailSec.addMtaSts({ 
  mode: MtaStsMode.ENFORCE 
});

// Add TLS-RPT record
emailSec.addTlsRpt();

// Enable automated reporting and alerts
emailSec.addAlerts({
  reportDomain: 'reports.example.com',
  alertEmail: 'security@example.com',
  aiEnrichment: { modelId: BedrockModelId.US_HAIKU_4_5 }
});
```

## Alert Email Example

When security failures are detected, you'll receive HTML email alerts with detailed information:

![Email Alert Example](Screenshot%202026-03-06%20134630.jpg)

Alerts include:
- Failed authentication details (SPF/DKIM failures)
- Source IP addresses with geolocation
- Threat intelligence (when AbuseIPDB is enabled)
- AI-generated summaries (when Bedrock is enabled)
- Actionable recommendations

## Documentation

See [API.md](./API.md) for complete API reference.

## License

Apache-2.0
