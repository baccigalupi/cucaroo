'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const Feature       = require('../../lib/feature');
const OutputStream  = require('./support/output-stream');
const Logger        = require('../../lib/logger');

describe('Feature', function() {
  let featureText, feature, mockStream, outputStream, logger, callCount;

  let ScenarioCollection = function() {
    this.run = function(callback) {
      callCount += 1;
      callback();
    };
  };

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    callCount     = 0;
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    logger        = new Logger(outputStream);

    featureText = {
      document: {
        feature: {
          name: 'Signing in',
          description: '  As a customer\n' +
                       '  I want to sign in to see subscribed content\n' +
                       '  So that I am informed\n'
        }
      }
    };
    Feature.ScenarioCollection = ScenarioCollection;

    feature = new Feature(featureText, {logger: logger});
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('.print() prints the name and description', function() {
    feature.print();
    let expectedText = `\nFeature: ${featureText.document.feature.name}\n${featureText.document.feature.description}\n\n`;
    assert.equal(mockStream.cleanOutput(), expectedText);
  });

  it('.run() calls run on a new ScenarioCollection instance', function(done) {
    feature.run(function() {
      assert.equal(callCount, 1);
      done();
    });
  });

  it('.run() prints the feature', function(done) {
    feature.run(function() {
      assert(mockStream.cleanOutput().length);
      done();
    });
  });
});
