import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { BedrockModelId } from '../src/bedrock';
import { EmailReporting, AbuseReportCondition } from '../src/emailsecurity/emailReporting';

describe('EmailReporting', () => {
  let app: App;
  let stack: Stack;
  let hostedZone: HostedZone;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', { env: { region: 'us-east-1', account: '123456789012' } });
    hostedZone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  });

  describe('constructor', () => {
    test('creates all required resources', () => {
      const reporting = new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      expect(reporting.bucket).toBeDefined();
      expect(reporting.eventBus).toBeDefined();
      expect(reporting.parserFunction).toBeDefined();
      expect(reporting.receiptRuleSet).toBeDefined();
    });

    test('creates S3 bucket with lifecycle rules', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            { ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } },
          ],
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
        LifecycleConfiguration: {
          Rules: Match.arrayWith([
            Match.objectLike({
              Id: 'DeleteOldRawEmails',
              Prefix: 'raw/',
              ExpirationInDays: 90,
            }),
            Match.objectLike({
              Id: 'TransitionParsedReports',
              Prefix: 'parsed/',
            }),
          ]),
        },
      });
    });

    test('creates EventBridge event bus', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Events::EventBus', {
        Name: 'TestStack-email-security-reports',
      });
    });

    test('creates Lambda parser function with correct environment', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        sesRegion: 'ap-southeast-2',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'python3.12',
        Handler: 'email-report-parser.handler',
        Timeout: 300,
        MemorySize: 512,
        Environment: {
          Variables: Match.objectLike({
            ALERT_EMAIL: 'security@example.com',
            REPORT_DOMAIN: 'reports.example.com',
            SES_REGION: 'ap-southeast-2',
          }),
        },
      });
    });

    test('defaults to stack region when sesRegion not specified', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
          Variables: Match.objectLike({
            SES_REGION: 'us-east-1',
          }),
        },
      });
    });

    test('grants Lambda permissions to S3 bucket', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:GetObject*', 's3:GetBucket*', 's3:List*']),
              Effect: 'Allow',
            }),
            Match.objectLike({
              Action: Match.arrayWith(['s3:PutObject', 's3:PutObjectLegalHold']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('grants Lambda permissions to EventBridge', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'events:PutEvents',
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('grants Lambda permissions to SES', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: ['ses:SendEmail', 'ses:SendRawEmail'],
              Effect: 'Allow',
              Resource: '*',
            }),
          ]),
        },
      });
    });

    test('creates S3 notification for Lambda', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::S3BucketNotifications', {
        NotificationConfiguration: {
          LambdaFunctionConfigurations: [
            Match.objectLike({
              Events: ['s3:ObjectCreated:*'],
              Filter: {
                Key: {
                  FilterRules: [{ Name: 'prefix', Value: 'raw/' }],
                },
              },
            }),
          ],
        },
      });
    });

    test('creates SES receipt rule set', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::SES::ReceiptRuleSet', {
        RuleSetName: 'TestStack-email-reports',
      });
    });

    test('creates SES receipt rule with S3 action', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::SES::ReceiptRule', {
        Rule: {
          Recipients: ['reports.example.com'],
          Actions: [
            Match.objectLike({
              S3Action: {
                ObjectKeyPrefix: 'raw/',
              },
            }),
          ],
        },
      });
    });

    test('creates MX record for report domain', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        sesRegion: 'ap-southeast-2',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'MX',
        Name: 'reports.example.com.',
        ResourceRecords: ['10 inbound-smtp.ap-southeast-2.amazonaws.com'],
      });
    });

    test('activates SES receipt rule set', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      const customResources = template.findResources('Custom::AWS');
      const activateResource = Object.entries(customResources).find(([, resource]: [string, any]) => {
        const createProp = resource.Properties?.Create;
        if (typeof createProp === 'string') {
          return createProp.includes('setActiveReceiptRuleSet');
        }
        if (typeof createProp === 'object' && createProp['Fn::Join']) {
          const joinParts = createProp['Fn::Join'][1];
          return JSON.stringify(joinParts).includes('setActiveReceiptRuleSet');
        }
        return false;
      });
      expect(activateResource).toBeDefined();
    });

    test('configures report domain security records', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);

      // SPF record
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: 'reports.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=spf1.*include:amazonses.com.*-all')],
      });

      // DMARC record
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: '_dmarc.reports.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=DMARC1.*p=reject.*pct=100')],
      });
    });

    test('creates SES identity for report domain', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::AWS', {
        Create: Match.stringLikeRegexp('.*createEmailIdentity.*reports.example.com.*'),
      });
    });

    test('fetches and creates DKIM records for report domain', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
      });

      const template = Template.fromStack(stack);
      const customResources = template.findResources('Custom::AWS');
      const getDkimResource = Object.entries(customResources).find(([, resource]: [string, any]) =>
        typeof resource.Properties?.Update === 'string' &&
        resource.Properties.Update.includes('getIdentityDkimAttributes') &&
        resource.Properties.Update.includes('reports.example.com'),
      );
      expect(getDkimResource).toBeDefined();

      // Should create 3 DKIM CNAME records - check for tokens in Name field
      const allRecords = template.findResources('AWS::Route53::RecordSet');
      const dkimRecords = Object.entries(allRecords).filter(([, resource]: [string, any]) => {
        const name = resource.Properties?.Name;
        // Name might be a token reference like { "Fn::Join": [...] }
        if (typeof name === 'object') {
          return JSON.stringify(name).includes('_domainkey') && JSON.stringify(name).includes('reports.example.com');
        }
        return resource.Properties?.Type === 'CNAME' &&
          typeof name === 'string' &&
          name.includes('_domainkey.reports.example.com');
      });
      expect(dkimRecords.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('AI enrichment', () => {
    test('configures Bedrock environment variables', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        aiEnrichment: {
          modelId: BedrockModelId.US_HAIKU_4_5,
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
          Variables: Match.objectLike({
            BEDROCK_MODEL_ID: BedrockModelId.US_HAIKU_4_5,
            BEDROCK_MODEL_NAME: Match.anyValue(),
          }),
        },
      });
    });

    test('grants Bedrock permissions to Lambda', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        aiEnrichment: {
          modelId: BedrockModelId.US_SONNET_4_5,
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'bedrock:InvokeModel',
              Effect: 'Allow',
              Resource: Match.arrayWith([
                Match.stringLikeRegexp('arn:aws:bedrock:.*:inference-profile/.*'),
                'arn:aws:bedrock:*::foundation-model/*',
              ]),
            }),
          ]),
        },
      });
    });

    test('validates unknown Bedrock model with custom resource', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        aiEnrichment: {
          modelId: 'custom-model-id',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('Custom::AWS', {
        Create: Match.stringLikeRegexp('.*getFoundationModel.*custom-model-id.*'),
      });
    });
  });

  describe('AbuseIPDB integration', () => {
    test('configures AbuseIPDB environment variables', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        abuseIpDb: {
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb-key',
          reportAbuse: AbuseReportCondition.HIGH_CONFIDENCE_ONLY,
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
          Variables: Match.objectLike({
            ABUSEIPDB_SECRET_ARN: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb-key',
            ABUSEIPDB_REPORT_CONDITION: AbuseReportCondition.HIGH_CONFIDENCE_ONLY,
          }),
        },
      });
    });

    test('grants Secrets Manager permissions to Lambda', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        abuseIpDb: {
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb-key',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'secretsmanager:GetSecretValue',
              Effect: 'Allow',
              Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb-key',
            }),
          ]),
        },
      });
    });

    test('defaults reportAbuse to NEVER when not specified', () => {
      new EmailReporting(stack, 'Reporting', {
        hostedZone: hostedZone,
        reportDomain: 'reports.example.com',
        alertEmail: 'security@example.com',
        abuseIpDb: {
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:abuseipdb-key',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
          Variables: Match.objectLike({
            ABUSEIPDB_REPORT_CONDITION: AbuseReportCondition.NEVER,
          }),
        },
      });
    });
  });
});
