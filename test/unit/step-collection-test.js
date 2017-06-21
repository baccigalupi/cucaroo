'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const StepCollection = require('../../lib/step-collection');
const Logger         = require('../../lib/logger');
const World          = require('../../lib/world');
const StepDefinitionCollection = require('../../lib/step-definition-collection');

const OutputStream    = require('./support/output-stream');
const compiledFeature = require('./support/sample-compiled-feature');

describe('StepCollection', function() {
  let runCount, compiledSteps, world, mockStream, outputStream, logger;

  let Step = function(compiledStep, matchingDefinitions, parent) {
    this.compiled = compiledStep;
    this.matchingDefinitions = matchingDefinitions;
    this.parent = parent;
    this.run = (done) => {
      runCount += 1;
      done();
    };
  };

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    runCount      = 0;
    StepCollection.Step = Step;
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    logger        = new Logger(outputStream);
    compiledSteps = compiledFeature.document.feature.children[0].steps;
    world         = new World({
      logger: logger,
      stepDefinitions: StepDefinitionCollection
    });
  });

  afterEach(function() {
    this.sinon.restore();
  });

  xit('calls run on each feature and then finished with the callback', function(done) {
    let features = new StepCollection(compiledSteps, world);
    features.run(function() {
      assert.equal(runCount, 2);
      done();
    });
  });
});
