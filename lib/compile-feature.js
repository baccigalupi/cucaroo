'use strict';

const Gherkin = require('gherkin');

function compileFeature(featureText, logger) {
  let parser = new Gherkin.Parser();
  let document = parser.parse(featureText, logger);
  let scenarios = new Gherkin.Compiler().compile(document);
  return {
    document: document,
    scenarios: scenarios
  };
}

function compileFeatureWithCatch(featureText, logger) {
  try {
    return compileFeature(featureText);
  } catch (e) {
    logger.warn(e.stack);
    process.emit('exit');
  }
}

compileFeatureWithCatch.compile = compileFeature;
module.exports = compileFeatureWithCatch;
