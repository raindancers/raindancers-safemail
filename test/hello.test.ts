import { emailSecurity, bedrock } from '../src';

test('exports are defined', () => {
  expect(emailSecurity.EmailSecurity).toBeDefined();
  expect(emailSecurity.EmailReporting).toBeDefined();
  expect(bedrock.BedrockModelId).toBeDefined();
});
