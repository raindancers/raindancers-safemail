import * as path from 'path';
import {
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_events as events,
  aws_ses as ses,
  aws_ses_actions as ses_actions,
  aws_route53 as route53,
  aws_iam as iam,
  aws_s3_notifications as s3n,
  custom_resources as cr,
  RemovalPolicy,
  Duration,
  Annotations,
} from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BedrockModelId } from '../bedrock';
import { AbuseReportCondition, AiEnrichmentConfig, AbuseIpDbConfig } from './shared';

export { AbuseReportCondition } from './shared';

export interface EmailReportingProps {
  readonly hostedZone: route53.IHostedZone;
  readonly reportDomain: string;
  readonly alertEmail: string;
  readonly sesRegion?: string;
  /** Enable AI-generated narrative enrichment via Amazon Bedrock. */
  readonly aiEnrichment?: AiEnrichmentConfig;
  /** Enable IP enrichment via AbuseIPDB. */
  readonly abuseIpDb?: AbuseIpDbConfig;
}

function resolveModelName(modelId: string): string {
  const entry = Object.entries(BedrockModelId).find(([, value]) => value === modelId);
  if (entry) {
    return entry[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  return modelId;
}

export class EmailReporting extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly eventBus: events.EventBus;
  public readonly parserFunction: lambda.Function;
  public readonly receiptRuleSet: ses.ReceiptRuleSet;

  constructor(scope: Construct, id: string, props: EmailReportingProps) {
    super(scope, id);

    const region = props.sesRegion ?? core.Stack.of(this).region;

    this.bucket = new s3.Bucket(this, 'ReportBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules: [
        { id: 'DeleteOldRawEmails', prefix: 'raw/', expiration: Duration.days(90) },
        {
          id: 'TransitionParsedReports',
          prefix: 'parsed/',
          transitions: [{ storageClass: s3.StorageClass.INFREQUENT_ACCESS, transitionAfter: Duration.days(30) }],
        },
      ],
    });

    this.eventBus = new events.EventBus(this, 'ReportEventBus', {
      eventBusName: `${core.Stack.of(this).stackName}-email-security-reports`,
    });

    this.parserFunction = new lambda.Function(this, 'ParserFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'email-report-parser.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/email-report-parser'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_12.bundlingImage,
          command: ['bash', '-c', 'pip install -r requirements.txt -t /asset-output && cp -r . /asset-output'],
        },
      }),
      timeout: Duration.minutes(5),
      memorySize: 512,
      environment: {
        EVENT_BUS_NAME: this.eventBus.eventBusName,
        ALERT_EMAIL: props.alertEmail,
        REPORT_DOMAIN: props.reportDomain,
        SES_REGION: region,
        ...(props.abuseIpDb && {
          ABUSEIPDB_SECRET_ARN: props.abuseIpDb.secretArn,
          ABUSEIPDB_REPORT_CONDITION: props.abuseIpDb.reportAbuse ?? AbuseReportCondition.NEVER,
        }),
        ...(props.aiEnrichment && {
          BEDROCK_MODEL_ID: props.aiEnrichment.modelId,
          BEDROCK_MODEL_NAME: resolveModelName(props.aiEnrichment.modelId),
        }),
      },
    });

    this.bucket.grantRead(this.parserFunction);
    this.bucket.grantPut(this.parserFunction);
    this.eventBus.grantPutEventsTo(this.parserFunction);

    this.parserFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    if (props.abuseIpDb) {
      this.parserFunction.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: [props.abuseIpDb.secretArn],
      }));
    }

    if (props.aiEnrichment) {
      const modelId = props.aiEnrichment.modelId;
      const knownValues = Object.values(BedrockModelId) as string[];

      if (!knownValues.includes(modelId)) {
        Annotations.of(this).addWarning(
          `aiEnrichment.modelId "${modelId}" is not a known BedrockModelId enum value. ` +
          'Verify the model ID is correct and available in this region.',
        );
        new cr.AwsCustomResource(this, 'ValidateBedrockModel', {
          onCreate: {
            service: 'Bedrock',
            action: 'getFoundationModel',
            parameters: { modelIdentifier: modelId },
            region: region,
            physicalResourceId: cr.PhysicalResourceId.of(`bedrock-model-${modelId}`),
          },
          policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
      }

      this.parserFunction.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: [
          `arn:aws:bedrock:${region}:${core.Stack.of(this).account}:inference-profile/${modelId}`,
          'arn:aws:bedrock:*::foundation-model/*',
        ],
      }));
    }

    this.bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(this.parserFunction),
      { prefix: 'raw/' },
    );

    this.receiptRuleSet = new ses.ReceiptRuleSet(this, 'ReceiptRuleSet', {
      receiptRuleSetName: `${core.Stack.of(this).stackName}-email-reports`,
    });

    this.receiptRuleSet.addRule('ReceiveReports', {
      recipients: [props.reportDomain],
      actions: [new ses_actions.S3({ bucket: this.bucket, objectKeyPrefix: 'raw/' })],
    });

    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('ses.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${this.bucket.bucketArn}/raw/*`],
      conditions: { StringEquals: { 'AWS:SourceAccount': core.Stack.of(this).account } },
    }));

    new route53.MxRecord(this, 'MxRecord', {
      zone: props.hostedZone,
      recordName: props.reportDomain,
      values: [{ priority: 10, hostName: `inbound-smtp.${region}.amazonaws.com` }],
    });

    const activateRuleSet = new cr.AwsCustomResource(this, 'ActivateReceiptRuleSet', {
      onCreate: {
        service: 'SES',
        action: 'setActiveReceiptRuleSet',
        parameters: { RuleSetName: this.receiptRuleSet.receiptRuleSetName },
        region: region,
        physicalResourceId: cr.PhysicalResourceId.of(`active-rule-set-${core.Stack.of(this).stackName}`),
      },
      onDelete: { service: 'SES', action: 'setActiveReceiptRuleSet', parameters: {}, region: region },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    activateRuleSet.node.addDependency(this.receiptRuleSet);

    this.configureReportDomainSecurity(props.hostedZone, props.reportDomain, region);
  }

  private configureReportDomainSecurity(hostedZone: route53.IHostedZone, reportDomain: string, region: string): void {
    const emailIdentity = new cr.AwsCustomResource(this, 'CreateReportDomainIdentity', {
      onCreate: {
        service: 'SESV2',
        action: 'createEmailIdentity',
        parameters: { EmailIdentity: reportDomain },
        region: region,
        physicalResourceId: cr.PhysicalResourceId.of(`ses-identity-${reportDomain}`),
      },
      onDelete: {
        service: 'SESV2',
        action: 'deleteEmailIdentity',
        parameters: { EmailIdentity: reportDomain },
        region: region,
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    new route53.TxtRecord(this, 'ReportDomainSpf', {
      zone: hostedZone, recordName: reportDomain, values: ['v=spf1 include:amazonses.com -all'],
    });

    const getDkimTokens = new cr.AwsCustomResource(this, 'GetReportDomainDkim', {
      onUpdate: {
        service: 'SES',
        action: 'getIdentityDkimAttributes',
        parameters: { Identities: [reportDomain] },
        region: region,
        physicalResourceId: cr.PhysicalResourceId.of(`ses-dkim-${reportDomain}`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    getDkimTokens.node.addDependency(emailIdentity);

    [0, 1, 2].forEach(index => {
      const token = getDkimTokens.getResponseField(`DkimAttributes.${reportDomain}.DkimTokens.${index}`);
      new route53.CnameRecord(this, `ReportDomainDkim${index}`, {
        zone: hostedZone,
        recordName: `${token}._domainkey.${reportDomain}`,
        domainName: `${token}.dkim.amazonses.com`,
      });
    });

    new route53.TxtRecord(this, 'ReportDomainDmarc', {
      zone: hostedZone, recordName: `_dmarc.${reportDomain}`, values: ['v=DMARC1; p=reject; pct=100'],
    });
  }
}
