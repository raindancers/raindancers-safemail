import { BedrockModelId } from '../bedrock';

/** Controls whether DMARC failure source IPs are reported back to AbuseIPDB. */
export enum AbuseReportCondition {
  /** Never report IPs back to AbuseIPDB. Lookup only. Default. */
  NEVER = 'NEVER',
  /** Report only when both DKIM and SPF fail AND disposition is reject. */
  HIGH_CONFIDENCE_ONLY = 'HIGH_CONFIDENCE_ONLY',
  /** Report for any DMARC failure. */
  ANY_FAILURE = 'ANY_FAILURE',
}

/** AI enrichment configuration via Amazon Bedrock. */
export interface AiEnrichmentConfig {
  /** Use a {@link BedrockModelId} enum value for known models, or a raw string for custom/future models. */
  readonly modelId: BedrockModelId | string;
}

/** AbuseIPDB IP enrichment configuration. */
export interface AbuseIpDbConfig {
  /** Secrets Manager ARN containing `{ "abuseIpDb": "<api-key>" }`. */
  readonly secretArn: string;
  /** Whether to report abusive IPs back to AbuseIPDB. Defaults to NEVER. */
  readonly reportAbuse?: AbuseReportCondition;
}
