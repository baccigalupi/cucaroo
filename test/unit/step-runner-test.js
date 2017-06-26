'use strict';

const assert = require('assert');
const sinon  = require('sinon');
const StepRunner = require('../../lib/step-runner');
const StepValue  = require('../../lib/step-value');

describe('StepValue', function() {
  let stepValue, runner, parent,
    compiledStep, matchingDefinitions, called;

  beforeEach(function() {
    called = false;
    compiledStep = {text: 'I am the step text', keyword: 'Given'};
    matchingDefinitions = [
      {
        implementation: (callback) => {
          called = true;
          callback();
        }
      }
    ];
    stepValue = new StepValue(compiledStep, matchingDefinitions);
    parent = { halted: function() { return false; } };
    runner = new StepRunner(stepValue, parent, 200);
  });

  it('emits a pass event when successful with the step', function(done) {
    stepValue.onAny(function(event, obj) {
      assert.equal(event, 'pass');
      assert.equal(obj, stepValue);
    });

    runner.run(done);
  });

  it('emits not-run event if the parent is halted with the step', function(done) {
    parent = { halted: function() { return true; } };
    runner.parent = parent;

    stepValue.onAny(function(event, obj) {
      assert.equal(event, 'not-run');
      assert.equal(obj, stepValue);
    });

    runner.run(done);
  });

  it('emits pending event if the step throws a pending error with the step', function(done) {
    stepValue.implementation = function(callback) {
      throw new Error('pending');
    };

    stepValue.onAny(function(event, obj) {
      assert.equal(event, 'pending');
      assert.equal(obj, stepValue);
    });

    runner.run(done);
  });

  it('emits an error if the step throws a non-pending error, with step and the error', function(done) {
    let err = new Error('Hot dang! Something went wrong');
    stepValue.implementation = function(callback) {
      throw err;
    };

    stepValue.onAny(function(event, obj, passedErr) {
      assert.equal(event, 'error');
      assert.equal(obj, stepValue);
      assert.equal(passedErr, err);
    });

    runner.run(done);
  });

  it('emits a timeout error when the timeout is exceeded', function(done) {
    stepValue.implementation = function(callback) {
      setTimeout(callback, 300);
    };

    stepValue.onAny(function(event, obj, err) {
      assert.equal(event, 'error');
      assert.equal(obj, stepValue);
      assert(err.message.match(/Step timed out/i));
    });

    runner.run(done);
  });
});
