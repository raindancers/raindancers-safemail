import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { MtaStsMode } from '../src/emailsecurity/emailSecurity';
import { MtaStsStack } from '../src/emailsecurity/mtaStsStack';

describe('MtaStsStack', () => {
  function createTestStack(app: App, id: string, props: Partial<any> = {}) {
    const parentStack = new Stack(app, `${id}Parent`, { env: { region: 'us-east-1', account: '123456789012' } });
    const hostedZone = HostedZone.fromHostedZoneAttributes(parentStack, 'Zone', {
      hostedZoneId: 'Z1234567890ABC',
      zoneName: 'example.com',
    });
    return new MtaStsStack(app, id, {
      hostedZone: hostedZone,
      domain: 'example.com',
      mode: MtaStsMode.ENFORCE,
      env: { region: 'us-east-1', account: '123456789012' },
      ...props,
    });
  }

  describe('constructor', () => {
    test('creates stack in us-east-1 region', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack', { env: { region: 'ap-southeast-2', account: '123456789012' } });
      expect(stack.region).toBe('us-east-1');
    });

    test('creates all required resources', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      expect(stack.bucket).toBeDefined();
      expect(stack.certificate).toBeDefined();
      expect(stack.distribution).toBeDefined();
    });

    test('creates S3 bucket with encryption and security', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
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
      });
    });

    test('creates ACM certificate for mta-sts subdomain', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'mta-sts.example.com',
        ValidationMethod: 'DNS',
      });
    });

    test('creates CloudFront distribution with HTTPS only', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          Enabled: true,
          Aliases: ['mta-sts.example.com'],
          DefaultCacheBehavior: {
            ViewerProtocolPolicy: 'https-only',
          },
        },
      });
    });

    test('creates CloudFront distribution with caching disabled', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          DefaultCacheBehavior: {
            CachePolicyId: Match.anyValue(),
          },
        },
      });
    });

    test('creates A record for mta-sts subdomain', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'A',
        Name: 'mta-sts.example.com.',
        AliasTarget: Match.objectLike({
          DNSName: Match.anyValue(),
        }),
      });
    });

    test('creates TXT record for MTA-STS version', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'TXT',
        Name: '_mta-sts.example.com.',
        ResourceRecords: [Match.stringLikeRegexp('v=STSv1.*id=')],
      });
    });

    test('creates Lambda function for policy deployment', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'python3.12',
        Handler: 'mta-sts-policy.handler',
        Timeout: 120,
      });
    });

    test('grants Lambda permissions to S3 bucket', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:PutObject', 's3:PutObjectLegalHold']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('grants Lambda permissions to Route53', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'route53:ListResourceRecordSets',
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('grants Lambda permissions to CloudFront', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'cloudfront:CreateInvalidation',
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('creates custom resource for policy deployment', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        Domain: 'example.com',
        Mode: MtaStsMode.ENFORCE,
        MaxAge: '86400',
      });
    });

    test('uses default maxAge of 86400 when not specified', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        MaxAge: '86400',
      });
    });

    test('uses custom maxAge when specified', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack', { maxAge: 604800 });
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        MaxAge: '604800',
      });
    });

    test('passes MX patterns to custom resource', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack', { mxPatterns: ['*.mail.example.com', 'mx.example.com'] });
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        MxPatterns: ['*.mail.example.com', 'mx.example.com'],
      });
    });

    test('uses empty array for MX patterns when not specified', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        MxPatterns: [],
      });
    });

    test('supports TESTING mode', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack', { mode: MtaStsMode.TESTING });
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        Mode: MtaStsMode.TESTING,
      });
    });

    test('passes hosted zone ID when no MX patterns specified', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack');
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        HostedZoneId: 'Z1234567890ABC',
      });
    });

    test('uses "unused" for hosted zone ID when MX patterns specified', () => {
      const app = new App();
      const stack = createTestStack(app, 'MtaStsStack', { mxPatterns: ['*.mail.example.com'] });
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        HostedZoneId: 'unused',
      });
    });
  });
});
