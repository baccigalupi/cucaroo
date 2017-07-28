'use strict';

const assert = require('assert');
const StepValue            = require('../../lib/step-value');
const StepValueCollection  = require('../../lib/step-value-collection');
const StepCollectionRunner = require('../../lib/step-collection-runner');

describe('StepCollectionRunner', function() {
  let stepValue, compiledStep, matchingDefinitions,
    steps, runner;

  beforeEach(function() {
    compiledStep = {text: 'I am the step text', keyword: 'Given'};
    matchingDefinitions = [
      {
        implementation: (callback) => {
          callback();
        }
      }
    ];
    stepValue = new StepValue(compiledStep, matchingDefinitions);

    steps = new StepValueCollection([stepValue]);
    runner = new StepCollectionRunner(steps, 200);
  });

  it('when a step fails', function(done) {
    let err = new Error('Hot dang! Something went wrong');
    stepValue.implementation = function(callback) {
      throw err;
    };

    runner.run(function() {
      assert.equal(runner.halted(), true);
      done();
    });
  });

  it('when a step is pending', function(done) {
    let err = new Error('Pending');
    stepValue.implementation = function(callback) {
      throw err;
    };

    runner.run(function() {
      assert.equal(runner.halted(), true);
      done();
    });
  });

  it('when a step is not run', function(done) {
    stepValue.implementation = function(callback) {
      stepValue.emit('not-run');
      callback();
    };

    runner.run(function() {
      assert.equal(runner.halted(), true);
      done();
    });
  });

  it('when a step passes', function(done) {
    runner.run(function() {
      assert.equal(runner.halted(), false);
      done();
    });
  });
});
