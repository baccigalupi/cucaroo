'use strict';

const Gherkin = require('gherkin');

function compileFeature(featureText) {
  let parser = new Gherkin.Parser();
  let document = parser.parse(featureText);
  let scenarios = new Gherkin.Compiler().compile(document);
  return {document: document, scenarios: scenarios};
}

function compileFeatureWithCatch(featureText) {
  try {
    return compileFeature(featureText);
  } catch (e) {
    console.log(e.stack);
    process.exit(1);
  }
}

compileFeatureWithCatch.compile = compileFeature;
module.exports = compileFeatureWithCatch;
