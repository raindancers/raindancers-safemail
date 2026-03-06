import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { BedrockModelId } from '../src/bedrock';
import {
  EmailSecurity,
  SpfInclude,
  SpfQualifier,
  DmarcPolicy,
  MtaStsMode,
} from '../src/emailsecurity/emailSecurity';
import { AbuseReportCondition } from '../src/emailsecurity/shared';

describe('EmailSecurity Integration', () => {
  test('complete setup with all features', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });

    emailSec.addSpf({ include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES], all: SpfQualifier.FAIL });
    emailSec.addSesDkim(['token1', 'token2', 'token3']);
    emailSec.addDmarc({ policy: DmarcPolicy.REJECT, percentage: 100, adkim: 's', aspf: 's' });
    emailSec.addTlsRpt();
    emailSec.addMtaSts({ mode: MtaStsMode.ENFORCE, maxAge: 604800 });
    emailSec.addAlerts({
      reportDomain: 'reports.example.com',
      alertEmail: 'security@example.com',
      sesRegion: 'us-east-1',
      aiEnrichment: { modelId: BedrockModelId.US_HAIKU_4_5 },
      abuseIpDb: {
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb',
        reportAbuse: AbuseReportCondition.HIGH_CONFIDENCE_ONLY,
      },
    });

    expect(emailSec.mtaStsStack).toBeDefined();
    expect(emailSec.emailReporting).toBeDefined();
  });

  test('minimal setup', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
    emailSec.addSpf({ include: [SpfInclude.GOOGLE_WORKSPACE], all: SpfQualifier.FAIL });
    emailSec.addDmarc({ policy: DmarcPolicy.NONE });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Route53::RecordSet', 2); // SPF + DMARC
  });

  test('setup with custom DKIM keys', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
    emailSec.addSpf({ ip4: ['203.0.113.10'], all: SpfQualifier.FAIL });
    emailSec.addDkim({ name: 'default', publicKey: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN' });
    emailSec.addDkim({ name: 'backup', publicKey: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GM' });
    emailSec.addDmarc({ policy: DmarcPolicy.QUARANTINE, percentage: 50 });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Route53::RecordSet', 4); // SPF + 2 DKIM + DMARC
  });

  test('setup with reporting but no AI enrichment', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
    emailSec.addSpf({ include: [SpfInclude.AMAZON_SES], all: SpfQualifier.FAIL });
    emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
    emailSec.addTlsRpt();
    emailSec.addAlerts({ reportDomain: 'reports.example.com', alertEmail: 'security@example.com' });

    expect(emailSec.emailReporting).toBeDefined();
    expect(emailSec.emailReporting?.bucket).toBeDefined();
    expect(emailSec.emailReporting?.parserFunction).toBeDefined();
  });

  test('setup with custom DMARC and TLS-RPT emails in addAlerts', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
    emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
    emailSec.addTlsRpt();
    emailSec.addAlerts({
      reportDomain: 'reports.example.com',
      alertEmail: 'security@example.com',
      dmarcEmail: 'custom-dmarc@reports.example.com',
      tlsRptEmail: 'custom-tls@reports.example.com',
    });

    const template = Template.fromStack(stack);
    const allRecords = template.findResources('AWS::Route53::RecordSet');
    const dmarcRecords = Object.entries(allRecords).filter(([, resource]: [string, any]) =>
      resource.Properties?.Name === '_dmarc.example.com.',
    );
    expect(dmarcRecords.length).toBeGreaterThan(0);
    const dmarcRecord = dmarcRecords[0][1] as any;
    expect(dmarcRecord.Properties.ResourceRecords[0]).toContain('custom-dmarc@reports.example.com');
  });

  test('setup with auto SES DKIM from identity', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });

    const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
    emailSec.addSpf({ include: [SpfInclude.AMAZON_SES], all: SpfQualifier.FAIL });
    emailSec.addSesDkimFromIdentity('us-east-1');
    emailSec.addDmarc({ policy: DmarcPolicy.REJECT });

    const template = Template.fromStack(stack);
    const customResources = template.findResources('Custom::AWS');
    const getDkimResource = Object.values(customResources).find((resource: any) =>
      resource.Properties?.Update?.includes?.('getIdentityDkimAttributes'),
    );
    expect(getDkimResource).toBeDefined();
  });
});
