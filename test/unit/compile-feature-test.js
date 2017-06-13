'use strict';

const assert          = require('assert');
const sinon           = require('sinon');
const path            = require('path');
const loadFeatures    = require('../../lib/load-features');
const compileFeature  = require('../../lib/compile-feature');

describe('compileFeatures', function() {
  let featureTexts, logger;

  beforeEach(function() {
    featureTexts = loadFeatures(path.resolve(__dirname, '../features'));
    logger = {
      warn: sinon.spy()
    };
  });

  it('uses gherkins to compile the features', function() {
    let features = featureTexts.map((featureText) => {
      return compileFeature(featureText, logger);
    });
    assert(features.length, 2);
    let featureNames = features.map((feature) => { return feature.document.feature.name; });
    assert.equal(featureNames[0], 'Signing in');
    assert.equal(featureNames[1], 'Signing up');
  });

  it('logs and exits when the gherkins is unable to compile', function() {
    let sandbox = sinon.sandbox.create();
    let feature = 'huh\nwhat?';
    process.emit = sinon.spy();
    compileFeature(feature, logger);
    assert(process.emit.calledWith('exit'));
    assert(logger.warn.called);
    sandbox.restore();
  });
});
