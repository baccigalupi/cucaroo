'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const Step         = require('../../lib/step');
const Logger       = require('../../lib/logger');
const StepDefinition = require('../../lib/step-definition');

const OutputStream    = require('./support/output-stream');
const compiledFeature = require('./support/sample-compiled-feature');

describe('Step', function() {
  let runCount, compiledStep, stepDefinitions, world, steps, step,
      mockStream, outputStream, logger;

  beforeEach(function() {
    mockStream      = new OutputStream();
    outputStream    = mockStream.stream;
    logger          = new Logger(outputStream);

    compiledStep    = compiledFeature.document.feature.children[0].steps[0];
    runCount        = 0;
    let implementation = function(done) {
      runCount += 1;
      done();
    };
    stepDefinitions = [new StepDefinition(compiledStep.text, implementation, 'Given')];

    world = {
      logger: logger,
      stepDefinitions: stepDefinitions,
      timeout: 5000
    };

    steps = {
      world: world,
      pending: false,
      error: false
    };
  });

  it('unpacks all the stuff it needs from passed in dependencies', function() {
    let step = new Step(compiledStep, stepDefinitions, steps);
    assert.equal(step.definitions, stepDefinitions);
    assert.equal(step.definition, stepDefinitions[0]);
    assert.equal(step.parent, steps);
    assert.equal(step.world, world);
    assert.equal(step.timeout, 5000);
  });

  it('valid() is true when there is exactly one step', function() {
    let step = new Step(compiledStep, stepDefinitions, steps);
    assert(step.valid());
  });

  it('valid() is false when there is not exactly one step', function() {
    let step = new Step(compiledStep, [], steps);
    assert(!step.valid());
    step = new Step(compiledStep, [{}, {}], steps);
    assert(!step.valid());
  });
});
