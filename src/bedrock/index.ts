/**
 * Cross-region inference profile IDs for Anthropic Claude models on Amazon Bedrock.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles.html
 */
export enum BedrockModelId {
  // Australia — ap-southeast-2 ↔ ap-southeast-4
  AU_HAIKU_4_5 = 'au.anthropic.claude-haiku-4-5-20251001-v1:0',
  AU_SONNET_4_5 = 'au.anthropic.claude-sonnet-4-5-20250929-v1:0',
  AU_SONNET_4_6 = 'au.anthropic.claude-sonnet-4-6',
  AU_OPUS_4_6 = 'au.anthropic.claude-opus-4-6-v1',

  // Japan — ap-northeast-1 ↔ ap-northeast-3
  JP_HAIKU_4_5 = 'jp.anthropic.claude-haiku-4-5-20251001-v1:0',
  JP_SONNET_4_5 = 'jp.anthropic.claude-sonnet-4-5-20250929-v1:0',
  JP_SONNET_4_6 = 'jp.anthropic.claude-sonnet-4-6',

  // Europe — eu-central-1, eu-west-1, eu-west-3 and others
  EU_HAIKU_4_5 = 'eu.anthropic.claude-haiku-4-5-20251001-v1:0',
  EU_SONNET_4_5 = 'eu.anthropic.claude-sonnet-4-5-20250929-v1:0',
  EU_SONNET_4_6 = 'eu.anthropic.claude-sonnet-4-6',
  EU_OPUS_4_5 = 'eu.anthropic.claude-opus-4-5-20251101-v1:0',
  EU_OPUS_4_6 = 'eu.anthropic.claude-opus-4-6-v1',

  // United States — us-east-1, us-east-2, us-west-2, ca-central-1
  US_HAIKU_4_5 = 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
  US_SONNET_4_5 = 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
  US_SONNET_4_6 = 'us.anthropic.claude-sonnet-4-6',
  US_OPUS_4_5 = 'us.anthropic.claude-opus-4-5-20251101-v1:0',
  US_OPUS_4_6 = 'us.anthropic.claude-opus-4-6-v1',

  // Global — all commercial AWS regions
  GLOBAL_HAIKU_4_5 = 'global.anthropic.claude-haiku-4-5-20251001-v1:0',
  GLOBAL_SONNET_4_5 = 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  GLOBAL_SONNET_4_6 = 'global.anthropic.claude-sonnet-4-6',
  GLOBAL_OPUS_4_5 = 'global.anthropic.claude-opus-4-5-20251101-v1:0',
  GLOBAL_OPUS_4_6 = 'global.anthropic.claude-opus-4-6-v1',
}
