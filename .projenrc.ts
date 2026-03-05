import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'Andrew Frazer',
  authorAddress: 'mrpackethead@users.noreply.github.com',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  name: 'raindancers-safemail',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/raindancers/raindancers-safemail',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();