import { BedrockModelId } from '../src/bedrock';
import { AbuseReportCondition } from '../src/emailsecurity/shared';

describe('BedrockModelId', () => {
  test('exports all regional model IDs', () => {
    expect(BedrockModelId.AU_HAIKU_4_5).toBe('au.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(BedrockModelId.AU_SONNET_4_5).toBe('au.anthropic.claude-sonnet-4-5-20250929-v1:0');
    expect(BedrockModelId.AU_SONNET_4_6).toBe('au.anthropic.claude-sonnet-4-6');
    expect(BedrockModelId.AU_OPUS_4_6).toBe('au.anthropic.claude-opus-4-6-v1');
  });

  test('exports Japan region model IDs', () => {
    expect(BedrockModelId.JP_HAIKU_4_5).toBe('jp.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(BedrockModelId.JP_SONNET_4_5).toBe('jp.anthropic.claude-sonnet-4-5-20250929-v1:0');
    expect(BedrockModelId.JP_SONNET_4_6).toBe('jp.anthropic.claude-sonnet-4-6');
  });

  test('exports Europe region model IDs', () => {
    expect(BedrockModelId.EU_HAIKU_4_5).toBe('eu.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(BedrockModelId.EU_SONNET_4_5).toBe('eu.anthropic.claude-sonnet-4-5-20250929-v1:0');
    expect(BedrockModelId.EU_SONNET_4_6).toBe('eu.anthropic.claude-sonnet-4-6');
    expect(BedrockModelId.EU_OPUS_4_5).toBe('eu.anthropic.claude-opus-4-5-20251101-v1:0');
    expect(BedrockModelId.EU_OPUS_4_6).toBe('eu.anthropic.claude-opus-4-6-v1');
  });

  test('exports US region model IDs', () => {
    expect(BedrockModelId.US_HAIKU_4_5).toBe('us.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(BedrockModelId.US_SONNET_4_5).toBe('us.anthropic.claude-sonnet-4-5-20250929-v1:0');
    expect(BedrockModelId.US_SONNET_4_6).toBe('us.anthropic.claude-sonnet-4-6');
    expect(BedrockModelId.US_OPUS_4_5).toBe('us.anthropic.claude-opus-4-5-20251101-v1:0');
    expect(BedrockModelId.US_OPUS_4_6).toBe('us.anthropic.claude-opus-4-6-v1');
  });

  test('exports global model IDs', () => {
    expect(BedrockModelId.GLOBAL_HAIKU_4_5).toBe('global.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(BedrockModelId.GLOBAL_SONNET_4_5).toBe('global.anthropic.claude-sonnet-4-5-20250929-v1:0');
    expect(BedrockModelId.GLOBAL_SONNET_4_6).toBe('global.anthropic.claude-sonnet-4-6');
    expect(BedrockModelId.GLOBAL_OPUS_4_5).toBe('global.anthropic.claude-opus-4-5-20251101-v1:0');
    expect(BedrockModelId.GLOBAL_OPUS_4_6).toBe('global.anthropic.claude-opus-4-6-v1');
  });
});

describe('AbuseReportCondition', () => {
  test('exports NEVER condition', () => {
    expect(AbuseReportCondition.NEVER).toBe('NEVER');
  });

  test('exports HIGH_CONFIDENCE_ONLY condition', () => {
    expect(AbuseReportCondition.HIGH_CONFIDENCE_ONLY).toBe('HIGH_CONFIDENCE_ONLY');
  });

  test('exports ANY_FAILURE condition', () => {
    expect(AbuseReportCondition.ANY_FAILURE).toBe('ANY_FAILURE');
  });
});
