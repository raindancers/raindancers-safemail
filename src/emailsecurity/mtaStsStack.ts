import * as path from 'path';
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_lambda as lambda,
  aws_iam as iam,
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  CustomResource,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MtaStsMode } from './emailSecurity';

export interface MtaStsStackProps extends StackProps {
  readonly hostedZone: route53.IHostedZone;
  readonly domain: string;
  readonly mode: MtaStsMode;
  readonly maxAge?: number;
  readonly mxPatterns?: string[];
}

export class MtaStsStack extends Stack {
  public readonly distribution: cloudfront.Distribution;
  public readonly bucket: s3.Bucket;
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: MtaStsStackProps) {
    super(scope, id, {
      ...props,
      env: { region: 'us-east-1', account: props.env?.account },
    });

    const maxAge = props.maxAge ?? 86400;

    this.bucket = new s3.Bucket(this, 'PolicyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: `mta-sts.${props.domain}`,
      validation: acm.CertificateValidation.fromDns(props.hostedZone),
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      domainNames: [`mta-sts.${props.domain}`],
      certificate: this.certificate,
    });

    new route53.ARecord(this, 'MtaStsAliasRecord', {
      zone: props.hostedZone,
      recordName: `mta-sts.${props.domain}`,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution)),
    });

    new route53.TxtRecord(this, 'MtaStsTxtRecord', {
      zone: props.hostedZone,
      recordName: `_mta-sts.${props.domain}`,
      values: [`v=STSv1; id=${Date.now()}`],
    });

    const policyFn = new lambda.Function(this, 'PolicyFn', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'mta-sts-policy.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/mta-sts-policy')),
      timeout: Duration.minutes(2),
    });

    this.bucket.grantPut(policyFn);

    policyFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['route53:ListResourceRecordSets'],
      resources: [props.hostedZone.hostedZoneArn],
    }));

    policyFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudfront:CreateInvalidation'],
      resources: [`arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`],
    }));

    new CustomResource(this, 'DeployPolicy', {
      serviceToken: policyFn.functionArn,
      properties: {
        HostedZoneId: props.mxPatterns ? 'unused' : props.hostedZone.hostedZoneId,
        Domain: props.domain,
        Mode: props.mode,
        MaxAge: String(maxAge),
        BucketName: this.bucket.bucketName,
        DistributionId: this.distribution.distributionId,
        MxPatterns: props.mxPatterns ?? [],
      },
    });
  }
}
