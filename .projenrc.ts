import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Andrew Frazer',
  authorAddress: 'mrpackethead@users.noreply.github.com',
  cdkVersion: '2.241.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  name: 'raindancers-safemail',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/raindancers/raindancers-safemail',
});

project.synth();