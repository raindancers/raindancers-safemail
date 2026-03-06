import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import {
  EmailSecurity,
  SpfInclude,
  SpfQualifier,
  DmarcPolicy,
  MtaStsMode,
} from '../src/emailsecurity/emailSecurity';

describe('EmailSecurity', () => {
  let app: App;
  let stack: Stack;
  let hostedZone: HostedZone;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  });

  describe('constructor', () => {
    test('creates construct with hosted zone', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      expect(emailSec.hostedZone).toBe(hostedZone);
      expect(emailSec.domain).toBe('example.com');
    });
  });

  describe('addSpf', () => {
    test('creates SPF record with include and fail', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSpf({
        include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES],
        all: SpfQualifier.FAIL,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: 'example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=spf1.*include:spf.protection.outlook.com.*include:amazonses.com.*-all')],
      });
    });

    test('creates SPF record with ip4 addresses', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSpf({
        ip4: ['203.0.113.10', '198.51.100.0/24'],
        all: SpfQualifier.FAIL,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        ResourceRecords: [Match.stringLikeRegexp('v=spf1 ip4:203.0.113.10 ip4:198.51.100.0/24 -all')],
      });
    });

    test('creates SPF record with ip6 addresses', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSpf({
        ip6: ['2001:db8::1'],
        all: SpfQualifier.SOFTFAIL,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        ResourceRecords: [Match.stringLikeRegexp('v=spf1 ip6:2001:db8::1 ~all')],
      });
    });

    test('creates SPF record with a and mx mechanisms', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSpf({
        a: true,
        mx: true,
        all: SpfQualifier.FAIL,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        ResourceRecords: [Match.stringLikeRegexp('v=spf1 a mx -all')],
      });
    });

    test('defaults to FAIL qualifier when not specified', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSpf({
        include: [SpfInclude.GOOGLE_WORKSPACE],
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('-all')],
      });
    });
  });

  describe('addDkim', () => {
    test('creates DKIM TXT record', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDkim({
        name: 'default',
        publicKey: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: 'default._domainkey.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN')],
      });
    });

    test('creates multiple DKIM records', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDkim({ name: 'selector1', publicKey: 'p=key1' });
      emailSec.addDkim({ name: 'selector2', publicKey: 'p=key2' });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Route53::RecordSet', 2); // 2 DKIM (no Zone NS in this test)
    });
  });

  describe('addDkimCname', () => {
    test('creates DKIM CNAME record', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDkimCname({
        name: 'abc123',
        target: 'abc123.dkim.amazonses.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'CNAME',
        Name: 'abc123._domainkey.example.com.',
        ResourceRecords: ['abc123.dkim.amazonses.com'],
      });
    });
  });

  describe('addDkimCnames', () => {
    test('creates multiple DKIM CNAME records', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDkimCnames([
        { name: 'abc123', target: 'abc123.dkim.amazonses.com' },
        { name: 'def456', target: 'def456.dkim.amazonses.com' },
      ]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: 'abc123._domainkey.example.com.',
      });
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: 'def456._domainkey.example.com.',
      });
    });
  });

  describe('addSesDkim', () => {
    test('creates SES DKIM CNAME records from tokens', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSesDkim(['token1', 'token2', 'token3']);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'CNAME',
        Name: 'token1._domainkey.example.com.',
        ResourceRecords: ['token1.dkim.amazonses.com'],
      });
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: 'token2._domainkey.example.com.',
      });
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: 'token3._domainkey.example.com.',
      });
    });
  });

  describe('addSesDkimFromIdentity', () => {
    test('creates custom resource to fetch DKIM tokens', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSesDkimFromIdentity();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::AWS', {
        ServiceToken: Match.anyValue(),
        Update: Match.stringLikeRegexp('.*getIdentityDkimAttributes.*example.com.*us-east-1.*'),
      });
    });

    test('uses specified region for SES identity', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addSesDkimFromIdentity('ap-southeast-2');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::AWS', {
        Update: Match.stringLikeRegexp('.*ap-southeast-2.*'),
      });
    });
  });

  describe('addDmarc', () => {
    test('creates DMARC record with reject policy', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.REJECT,
        percentage: 100,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: '_dmarc.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=DMARC1.*p=reject.*pct=100')],
      });
    });

    test('creates DMARC record with quarantine policy', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.QUARANTINE,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('p=quarantine')],
      });
    });

    test('creates DMARC record with subdomain policy', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.REJECT,
        subdomainPolicy: DmarcPolicy.QUARANTINE,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('sp=quarantine')],
      });
    });

    test('creates DMARC record with rua addresses', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.REJECT,
        rua: ['mailto:dmarc@example.com'],
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('rua=mailto:dmarc@example.com')],
      });
    });

    test('creates DMARC record with ruf addresses', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.REJECT,
        ruf: ['mailto:forensic@example.com'],
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('ruf=mailto:forensic@example.com')],
      });
    });

    test('creates DMARC record with alignment modes', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({
        policy: DmarcPolicy.REJECT,
        adkim: 's',
        aspf: 's',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('adkim=s.*aspf=s')],
      });
    });

    test('throws when called twice', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });

      expect(() => {
        emailSec.addDmarc({ policy: DmarcPolicy.QUARANTINE });
      }).toThrow('addDmarc() has already been called');
    });

    test('throws when called with rua after addAlerts', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
      emailSec.addTlsRpt();
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      expect(() => {
        emailSec.addDmarc({ policy: DmarcPolicy.REJECT, rua: ['mailto:test@example.com'] });
      }).toThrow();
    });
  });

  describe('addTlsRpt', () => {
    test('creates TLS-RPT record with default email', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addTlsRpt();

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: '_smtp._tls.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=TLSRPTv1.*rua=mailto:tls-reports@example.com')],
      });
    });

    test('creates TLS-RPT record with custom email', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addTlsRpt('custom@example.com');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        ResourceRecords: [Match.stringLikeRegexp('mailto:custom@example.com')],
      });
    });

    test('throws when called twice with reportEmail', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addTlsRpt('custom@example.com');

      expect(() => {
        emailSec.addTlsRpt('another@example.com');
      }).toThrow('addTlsRpt() has already been called');
    });

    test('throws when called with email after addAlerts', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
      emailSec.addTlsRpt();
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      expect(() => {
        emailSec.addTlsRpt('test@example.com');
      }).toThrow();
    });
  });

  describe('addMtaSts', () => {
    test('creates MTA-STS nested stack', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addMtaSts({
        mode: MtaStsMode.ENFORCE,
      });

      expect(emailSec.mtaStsStack).toBeDefined();
      expect(emailSec.mtaStsStack?.stackName).toContain('MtaSts');
    });

    test('passes configuration to nested stack', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addMtaSts({
        mode: MtaStsMode.TESTING,
        maxAge: 604800,
        mxPatterns: ['*.mail.example.com'],
      });

      expect(emailSec.mtaStsStack).toBeDefined();
    });
  });

  describe('addAlerts', () => {
    test('creates EmailReporting construct', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
      emailSec.addTlsRpt();
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      expect(emailSec.emailReporting).toBeDefined();
    });

    test('updates DMARC record with report email', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: '_dmarc.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('rua=mailto:dmarc@reports.example.com')],
      });
    });

    test('updates TLS-RPT record with report email', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addTlsRpt();
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Name: '_smtp._tls.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('mailto:tls-reports@reports.example.com')],
      });
    });

    test('throws when DMARC has rua parameter', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT, rua: ['mailto:test@example.com'] });

      expect(() => {
        emailSec.addAlerts({
          reportDomain: 'reports.example.com',
          alertEmail: 'security@example.com',
        });
      }).toThrow('Cannot use addAlerts() when addDmarc() was called with rua parameter');
    });

    test('throws when called with rua after addAlerts', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addDmarc({ policy: DmarcPolicy.REJECT });
      emailSec.addTlsRpt();
      emailSec.addAlerts({
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      expect(() => {
        emailSec.addDmarc({ policy: DmarcPolicy.REJECT, rua: ['mailto:test@example.com'] });
      }).toThrow();
    });

    test('throws when TLS-RPT has reportEmail parameter', () => {
      const emailSec = new EmailSecurity(stack, 'EmailSec', { hostedZone: hostedZone });
      emailSec.addTlsRpt('custom@example.com');

      expect(() => {
        emailSec.addAlerts({
          reportDomain: 'reports.example.com',
          alertEmail: 'security@example.com',
        });
      }).toThrow('Cannot use addAlerts() when addTlsRpt() was called with reportEmail parameter');
    });
  });
});
