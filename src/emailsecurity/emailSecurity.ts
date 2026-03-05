import {


  aws_route53 as route53,


  custom_resources as cr,
} from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EmailReporting } from './emailReporting';
import { MtaStsStack } from './mtaStsStack';
import { AiEnrichmentConfig, AbuseIpDbConfig } from './shared';

/** Controls whether MTA-STS policy is actively enforced or in observation mode. */
export enum MtaStsMode {
  /** Receiving servers MUST use TLS. Mail is rejected if TLS cannot be negotiated. */
  ENFORCE = 'enforce',
  /** Policy is published but not enforced. Use this to test before switching to ENFORCE. */
  TESTING = 'testing',
}

/** DMARC policy applied to emails that fail SPF/DKIM alignment checks. */
export enum DmarcPolicy {
  /** No action taken. Use for monitoring only — reports are still sent. */
  NONE = 'none',
  /** Failing messages are sent to the recipient's spam/junk folder. */
  QUARANTINE = 'quarantine',
  /** Failing messages are rejected outright. Strongest protection. */
  REJECT = 'reject',
}

/**
 * Well-known SPF `include:` targets for common email service providers.
 * Each value delegates SPF authorization to that provider's published SPF record.
 */
export enum SpfInclude {
  /** Microsoft 365 / Exchange Online */
  MICROSOFT_365 = 'spf.protection.outlook.com',
  /** Google Workspace (Gmail) */
  GOOGLE_WORKSPACE = '_spf.google.com',
  /** Amazon SES */
  AMAZON_SES = 'amazonses.com',
  /** SendGrid */
  SENDGRID = 'sendgrid.net',
  /** Mailgun */
  MAILGUN = 'mailgun.org',
  /** Mailchimp / Mandrill */
  MAILCHIMP = 'servers.mcsv.net',
}

/** Controls what receiving servers do with mail that doesn't match any SPF mechanism (`all` qualifier). */
export enum SpfQualifier {
  /** `+all` — authorize all senders not matched above. Not recommended. */
  PASS = 'pass',
  /** `-all` — reject mail from senders not matched above. Recommended for production. */
  FAIL = 'fail',
  /** `~all` — mark as suspicious but accept. Useful during migration/testing. */
  SOFTFAIL = 'softfail',
  /** `?all` — no policy statement. Rarely used. */
  NEUTRAL = 'neutral',
}

/** A DKIM selector published as a TXT record (`<name>._domainkey.<domain>`). */
export interface DkimSelector {
  /** Selector name, e.g. `'default'` or `'google'`. */
  readonly name: string;
  /** Full public key value, e.g. `'p=MIGfMA0GCSqGSIb3...'`. */
  readonly publicKey: string;
}

/** A DKIM selector published as a CNAME record, used by providers that manage keys on your behalf. */
export interface DkimCnameSelector {
  /** Selector name, e.g. `'selector1'`. */
  readonly name: string;
  /** The CNAME target the provider instructs you to point to. */
  readonly target: string;
}

/**
 * Configuration for the SPF TXT record published at the root of the domain.
 *
 * @example
 * // Microsoft 365 + SES, reject all others
 * emailSec.addSpf({
 *   include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES],
 *   all: SpfQualifier.FAIL,
 * });
 *
 * @example
 * // Self-hosted mail server with a static IP
 * emailSec.addSpf({
 *   ip4: ['203.0.113.10'],
 *   all: SpfQualifier.FAIL,
 * });
 */
export interface SpfConfig {
  /** Delegate to another domain's SPF record. Use `SpfInclude` for well-known providers. */
  readonly include?: (string | SpfInclude)[];
  /** Authorize the IPv4 addresses in the domain's own A records to send mail. */
  readonly a?: boolean;
  /** Authorize the IP addresses of the domain's MX records to send mail. */
  readonly mx?: boolean;
  /** Explicitly authorize specific IPv4 addresses or CIDR ranges, e.g. `['203.0.113.10', '198.51.100.0/24']`. */
  readonly ip4?: string[];
  /** Explicitly authorize specific IPv6 addresses or CIDR ranges. */
  readonly ip6?: string[];
  /** What to do with senders not matched by any mechanism. Defaults to `SpfQualifier.FAIL`. */
  readonly all?: SpfQualifier;
}

/**
 * Configuration for the DMARC TXT record published at `_dmarc.<domain>`.
 *
 * @example
 * emailSec.addDmarc({
 *   policy: DmarcPolicy.REJECT,
 *   percentage: 100,
 *   adkim: 's',
 *   aspf: 's',
 * });
 */
export interface DmarcConfig {
  /** Policy applied to mail that fails DMARC alignment. */
  readonly policy: DmarcPolicy;
  /** Override policy for subdomains. Defaults to the root `policy` if omitted. */
  readonly subdomainPolicy?: DmarcPolicy;
  /**
   * Aggregate report recipients (`rua`). Each entry must be a `mailto:` URI.
   * Omit when using `addAlerts()` — it sets this automatically.
   */
  readonly rua?: string[];
  /**
   * Forensic/failure report recipients (`ruf`). Each entry must be a `mailto:` URI.
   * Note: many providers no longer send forensic reports.
   */
  readonly ruf?: string[];
  /** Percentage of failing messages to apply the policy to (1–100). Useful for gradual rollout. */
  readonly percentage?: number;
  /** DKIM alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required). */
  readonly adkim?: 'r' | 's';
  /** SPF alignment mode: `'r'` = relaxed (default), `'s'` = strict (exact domain match required). */
  readonly aspf?: 'r' | 's';
}

/** Configuration for {@link EmailSecurity.addMtaSts}. */
export interface AddMtaStsConfig {
  readonly mode: MtaStsMode;
  readonly maxAge?: number;
  readonly mxPatterns?: string[];
}

/** Configuration for {@link EmailSecurity.addAlerts}. */
export interface AddAlertsConfig {
  readonly reportDomain: string;
  readonly alertEmail: string;
  readonly sesRegion?: string;
  readonly dmarcEmail?: string;
  readonly tlsRptEmail?: string;
  readonly aiEnrichment?: AiEnrichmentConfig;
  readonly abuseIpDb?: AbuseIpDbConfig;
}

/** Props for the {@link EmailSecurity} construct. */
export interface EmailSecurityProps {
  /** The Route53 hosted zone for the domain being secured. */
  readonly hostedZone: route53.IHostedZone;
}

/**
 * CDK construct that adds email security DNS records to a Route53 hosted zone.
 *
 * Call the `add*` methods to publish SPF, DKIM, DMARC, MTA-STS, and TLS-RPT records.
 *
 * @example
 * const emailSec = new EmailSecurity(this, 'EmailSecurity', { hostedZone });
 *
 * emailSec.addSpf({ include: [SpfInclude.MICROSOFT_365], all: SpfQualifier.FAIL });
 * emailSec.addMicrosoft365Dkim();
 * emailSec.addDmarc({ policy: DmarcPolicy.REJECT, percentage: 100 });
 * emailSec.addMtaSts({ mode: MtaStsMode.ENFORCE });
 * emailSec.addTlsRpt();
 */
export class EmailSecurity extends Construct {
  public readonly hostedZone: route53.IHostedZone;
  public readonly domain: string;
  public mtaStsStack?: MtaStsStack;
  public emailReporting?: EmailReporting;

  private dkimCount = 0;
  private dmarcConfig?: DmarcConfig;
  private tlsRptEmail?: string;
  private dmarcRecord?: route53.TxtRecord;
  private tlsRptRecord?: route53.TxtRecord;

  constructor(scope: Construct, id: string, props: EmailSecurityProps) {
    super(scope, id);

    this.hostedZone = props.hostedZone;
    this.domain = props.hostedZone.zoneName;
  }

  /**
   * Publishes an MTA-STS policy requiring TLS for inbound mail delivery.
   *
   * Creates a cross-region nested stack in `us-east-1` (required for CloudFront)
   * that hosts the policy file at `https://mta-sts.<domain>/.well-known/mta-sts.txt`
   * and adds the `_mta-sts` TXT DNS record.
   *
   * **Important:** The nested stack must be deployed separately:
   * ```
   * npx cdk deploy "MyStack/MyStack-MtaSts"
   * ```
   *
   *
   * @example
   * emailSec.addMtaSts({ mode: MtaStsMode.ENFORCE });
   */
  public addMtaSts(config: AddMtaStsConfig): void {
    const stack = core.Stack.of(this);
    this.mtaStsStack = new MtaStsStack(stack, `${stack.stackName}-MtaSts`, {
      hostedZone: this.hostedZone,
      domain: this.domain,
      mode: config.mode,
      maxAge: config.maxAge,
      mxPatterns: config.mxPatterns,
      env: { region: 'us-east-1', account: stack.account },
    });
  }

  /**
   * Publishes a TLS-RPT record (`_smtp._tls.<domain>`) requesting TLS failure reports from sending servers.
   *
   * If `addAlerts()` is also called, omit `reportEmail` — it will be set automatically
   * to `tls-reports@<reportDomain>`.
   *
   * @param reportEmail - Address to receive TLS-RPT reports. Defaults to `tls-reports@<domain>`.
   * @throws If called after `addAlerts()`, or called twice with a `reportEmail`.
   *
   * @example
   * // Simple usage — reports go to tls-reports@example.com
   * emailSec.addTlsRpt();
   *
   * @example
   * // Custom address
   * emailSec.addTlsRpt('tls@reports.example.com');
   */
  public addTlsRpt(reportEmail?: string): void {
    if (this.emailReporting) {
      throw new Error('Cannot call addTlsRpt() with reportEmail when addReporting() is used. Remove the reportEmail parameter.');
    }
    if (reportEmail && this.tlsRptEmail) {
      throw new Error('addTlsRpt() has already been called');
    }

    this.tlsRptEmail = reportEmail;
    const email = reportEmail ?? `tls-reports@${this.domain}`;
    this.tlsRptRecord = new route53.TxtRecord(this, 'TlsRptRecord', {
      zone: this.hostedZone,
      recordName: `_smtp._tls.${this.domain}`,
      values: [`"v=TLSRPTv1; rua=mailto:${email}"`],
    });
  }

  /**
   * Deploys the `EmailReporting` construct which receives DMARC and TLS-RPT reports,
   * parses them, and sends HTML alert emails for failures.
   *
   * Also updates the DMARC `rua` and TLS-RPT `rua` records to point to the report domain.
   * Call `addDmarc()` and `addTlsRpt()` **before** `addAlerts()` so the records exist to be updated.
   *
   * @throws If `addDmarc()` was called with `rua`, or `addTlsRpt()` was called with `reportEmail`.
   *
   * @example
   * emailSec.addDmarc({ policy: DmarcPolicy.REJECT, percentage: 100 });
   * emailSec.addTlsRpt();
   * emailSec.addAlerts({
   *   reportDomain: 'reports.example.com',
   *   alertEmail: 'security@example.com',
   *   sesRegion: 'ap-southeast-2',
   * });
   */
  public addAlerts(config: AddAlertsConfig): void {
    if (this.dmarcConfig?.rua) {
      throw new Error('Cannot use addAlerts() when addDmarc() was called with rua parameter. Remove rua from addDmarc().');
    }
    if (this.tlsRptEmail) {
      throw new Error('Cannot use addAlerts() when addTlsRpt() was called with reportEmail parameter. Remove reportEmail from addTlsRpt().');
    }

    this.emailReporting = new EmailReporting(this, 'Reporting', {
      hostedZone: this.hostedZone,
      reportDomain: config.reportDomain,
      alertEmail: config.alertEmail,
      sesRegion: config.sesRegion,
      aiEnrichment: config.aiEnrichment,
      abuseIpDb: config.abuseIpDb,
    });

    if (this.dmarcRecord) {
      const dmarcEmail = config.dmarcEmail ?? `dmarc@${config.reportDomain}`;
      const updatedConfig = {
        ...this.dmarcConfig!,
        rua: [`mailto:${dmarcEmail}`],
      };
      const dmarcRecord = this.generateDmarcRecord(updatedConfig);
      (this.dmarcRecord.node.defaultChild as route53.CfnRecordSet).resourceRecords = [dmarcRecord];
    }

    if (this.tlsRptRecord) {
      const email = config.tlsRptEmail ?? `tls-reports@${config.reportDomain}`;
      (this.tlsRptRecord.node.defaultChild as route53.CfnRecordSet).resourceRecords = [`"v=TLSRPTv1; rua=mailto:${email}"`];
    }
  }

  /**
   * Publishes an SPF TXT record at the root of the domain.
   *
   * Builds the record from the provided mechanisms in RFC 7208 order:
   * `ip4` → `ip6` → `a` → `mx` → `include` → `all`.
   *
   * @example
   * // Microsoft 365 + SES only, reject everything else
   * emailSec.addSpf({
   *   include: [SpfInclude.MICROSOFT_365, SpfInclude.AMAZON_SES],
   *   all: SpfQualifier.FAIL,
   * });
   * // Produces: "v=spf1 include:spf.protection.outlook.com include:amazonses.com -all"
   */
  public addSpf(config: SpfConfig): void {
    const spfRecord = this.generateSpfRecord(config);
    new route53.TxtRecord(this, 'SpfRecord', {
      zone: this.hostedZone,
      recordName: this.domain,
      values: [spfRecord],
    });
  }

  /**
   * Publishes a DKIM public key as a TXT record (`<name>._domainkey.<domain>`).
   * Use this when you manage your own DKIM keys.
   * For managed providers use `addDkimCname()`, `addMicrosoft365Dkim()`, or `addSesDkim()`.
   *
   * @example
   * emailSec.addDkim({
   *   name: 'default',
   *   publicKey: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN...',
   * });
   */
  public addDkim(selector: DkimSelector): void {
    new route53.TxtRecord(this, `DkimRecord${this.dkimCount++}`, {
      zone: this.hostedZone,
      recordName: `${selector.name}._domainkey.${this.domain}`,
      values: [`v=DKIM1; k=rsa; ${selector.publicKey}`],
    });
  }

  /**
   * Publishes a single DKIM CNAME record (`<name>._domainkey.<domain>` → `<target>`).
   * Used by providers (SES, Microsoft 365) that manage DKIM keys on your behalf.
   *
   * @example
   * emailSec.addDkimCname({
   *   name: 'abc123',
   *   target: 'abc123.dkim.amazonses.com',
   * });
   */
  public addDkimCname(selector: DkimCnameSelector): void {
    new route53.CnameRecord(this, `DkimCname${this.dkimCount++}`, {
      zone: this.hostedZone,
      recordName: `${selector.name}._domainkey.${this.domain}`,
      domainName: selector.target,
    });
  }

  /**
   * Convenience wrapper that calls `addDkimCname()` for each selector in the array.
   *
   * @example
   * emailSec.addDkimCnames([
   *   { name: 'abc123', target: 'abc123.dkim.amazonses.com' },
   *   { name: 'def456', target: 'def456.dkim.amazonses.com' },
   * ]);
   */
  public addDkimCnames(selectors: DkimCnameSelector[]): void {
    selectors.forEach(selector => this.addDkimCname(selector));
  }

  /**
   * Publishes SES DKIM CNAME records from known token values.
   * Use this when you already have the three DKIM tokens from SES
   * (e.g. retrieved manually or from another stack output).
   * Prefer `addSesDkimFromIdentity()` to fetch tokens automatically at deploy time.
   *
   * @param tokens - The three DKIM token strings provided by SES.
   *
   * @example
   * emailSec.addSesDkim(['abc123', 'def456', 'ghi789']);
   */
  public addSesDkim(tokens: string[]): void {
    this.addDkimCnames(
      tokens.map(token => ({
        name: token,
        target: `${token}.dkim.amazonses.com`,
      })),
    );
  }

  /**
   * Automatically fetches the three SES DKIM tokens for the domain at deploy time
   * using a custom resource, then publishes the CNAME records.
   *
   * Requires the SES identity for the domain to already exist in the target region.
   * The custom resource calls `ses:getIdentityDkimAttributes` during deployment.
   *
   * @param sesRegion - Region where the SES identity exists. Defaults to the stack region.
   *
   * @example
   * // SES identity is in the same region as the stack
   * emailSec.addSesDkimFromIdentity();
   *
   * @example
   * // SES identity is in a different region
   * emailSec.addSesDkimFromIdentity('us-east-1');
   */
  public addSesDkimFromIdentity(sesRegion?: string): void {
    const region = sesRegion ?? core.Stack.of(this).region;

    const getDkimTokens = new cr.AwsCustomResource(this, 'GetSesDkimTokens', {
      onUpdate: {
        service: 'SES',
        action: 'getIdentityDkimAttributes',
        parameters: {
          Identities: [this.domain],
        },
        region: region,
        physicalResourceId: cr.PhysicalResourceId.of(`ses-dkim-${this.domain}`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    const tokens = [
      getDkimTokens.getResponseField(`DkimAttributes.${this.domain}.DkimTokens.0`),
      getDkimTokens.getResponseField(`DkimAttributes.${this.domain}.DkimTokens.1`),
      getDkimTokens.getResponseField(`DkimAttributes.${this.domain}.DkimTokens.2`),
    ];

    tokens.forEach((token, index) => {
      new route53.CnameRecord(this, `SesDkimAuto${index}`, {
        zone: this.hostedZone,
        recordName: `${token}._domainkey.${this.domain}`,
        domainName: `${token}.dkim.amazonses.com`,
      });
    });
  }

  /**
   * Publishes a DMARC TXT record at `_dmarc.<domain>`.
   *
   * If `addAlerts()` will also be called, omit `rua` — it will be set automatically.
   * Call `addDmarc()` before `addAlerts()` so the record exists to be updated.
   *
   * @throws If called after `addAlerts()` with a `rua` value, or called twice.
   *
   * @example
   * emailSec.addDmarc({
   *   policy: DmarcPolicy.REJECT,
   *   percentage: 100,
   * });
   * // Produces: "v=DMARC1; p=reject; pct=100"
   */
  public addDmarc(config: DmarcConfig): void {
    if (this.emailReporting && config.rua) {
      throw new Error('Cannot call addDmarc() with rua when addReporting() is used. Remove the rua parameter.');
    }
    if (this.dmarcConfig) {
      throw new Error('addDmarc() has already been called');
    }

    this.dmarcConfig = config;
    const dmarcRecord = this.generateDmarcRecord(config);
    this.dmarcRecord = new route53.TxtRecord(this, 'DmarcRecord', {
      zone: this.hostedZone,
      recordName: `_dmarc.${this.domain}`,
      values: [dmarcRecord],
    });
  }

  private generateSpfRecord(config: SpfConfig): string {
    const parts = ['v=spf1'];

    if (config.ip4) {
      config.ip4.forEach(ip => parts.push(`ip4:${ip}`));
    }

    if (config.ip6) {
      config.ip6.forEach(ip => parts.push(`ip6:${ip}`));
    }

    if (config.a) {
      parts.push('a');
    }

    if (config.mx) {
      parts.push('mx');
    }

    if (config.include) {
      config.include.forEach(domain => parts.push(`include:${domain}`));
    }

    const allQualifier = config.all ?? SpfQualifier.FAIL;
    const qualifierMap: Record<SpfQualifier, string> = {
      [SpfQualifier.PASS]: '+all',
      [SpfQualifier.FAIL]: '-all',
      [SpfQualifier.SOFTFAIL]: '~all',
      [SpfQualifier.NEUTRAL]: '?all',
    };
    parts.push(qualifierMap[allQualifier]);

    return parts.join(' ');
  }

  private generateDmarcRecord(config: DmarcConfig): string {
    const parts = ['v=DMARC1', `p=${config.policy}`];

    if (config.subdomainPolicy) {
      parts.push(`sp=${config.subdomainPolicy}`);
    }

    if (config.rua && config.rua.length > 0) {
      parts.push(`rua=${config.rua.join(',')}`);
    }

    if (config.ruf && config.ruf.length > 0) {
      parts.push(`ruf=${config.ruf.join(',')}`);
    }

    if (config.percentage !== undefined) {
      parts.push(`pct=${config.percentage}`);
    }

    if (config.adkim) {
      parts.push(`adkim=${config.adkim}`);
    }

    if (config.aspf) {
      parts.push(`aspf=${config.aspf}`);
    }

    return `"${parts.join('; ')}"`;
  }
}
