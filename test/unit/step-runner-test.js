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
    let eventType, step, error;
    stepValue.onAny(function(event, obj, passedErr) {
      eventType = event;
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(eventType, 'pass');
      assert.equal(step, stepValue);
      done();
    });
  });

  it('emits not-run event if the parent is halted with the step', function(done) {
    parent = { halted: function() { return true; } };
    runner.parent = parent;

    let eventType, step, error;
    stepValue.onAny(function(event, obj, passedErr) {
      eventType = event;
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(eventType, 'not-run');
      assert.equal(step, stepValue);
      done();
    });
  });

  it('emits pending event if the step throws a pending error with the step', function(done) {
    stepValue.implementation = function(callback) {
      throw new Error('pending');
    };

    let eventType, step, error;
    stepValue.onAny(function(event, obj, passedErr) {
      eventType = event;
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(eventType, 'pending');
      assert.equal(step, stepValue);
      done();
    });
  });

  it('emits an error if the step throws a non-pending error, with step and the error', function(done) {
    let err = new Error('Hot dang! Something went wrong');
    stepValue.implementation = function(callback) {
      throw err;
    };

    let eventType, step, error;
    stepValue.onAny(function(event, obj, passedErr) {
      eventType = event;
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(eventType, 'fail');
      assert.equal(step, stepValue);
      assert.equal(error, err);
      done();
    });
  });

  it('emits a timeout error when the timeout is exceeded', function(done) {
    stepValue.implementation = function(callback) {
      setTimeout(callback, 300);
    };

    let eventType, step, error;
    stepValue.onAny(function(event, obj, passedErr) {
      eventType = event;
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(eventType, 'fail');
      assert.equal(step, stepValue);
      assert(error.message.match(/Step timed out/i));
      done();
    });
  });
});
