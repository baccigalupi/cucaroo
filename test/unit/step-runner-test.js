'use strict';

const assert = require('assert');
const sinon  = require('sinon');
const StepRunner = require('../../lib/step-runner');
const StepValue  = require('../../lib/step-value');

describe('StepRunner', function() {
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
    let step;
    stepValue.on('pass', function(obj) {
      step = obj;
    });

    runner.run(function() {
      assert.equal(step, stepValue);
      done();
    });
  });

  it('emits not-run event if the parent is halted with the step', function(done) {
    parent = { halted: function() { return true; } };
    runner.parent = parent;

    let called;
    stepValue.on('not-run', function(obj) {
      called = true;
    });

    runner.run(function() {
      assert(called);
      done();
    });
  });

  it('emits pending event if the step throws a pending error with the step', function(done) {
    stepValue.implementation = function(callback) {
      throw new Error('pending');
    };

    let step;
    stepValue.on('pending', function(obj) {
      step = obj;
    });

    runner.run(function() {
      assert.equal(step, stepValue);
      done();
    });
  });

  it('emits an error if the step throws a non-pending error, with step and the error', function(done) {
    let err = new Error('Hot dang! Something went wrong');
    stepValue.implementation = function(callback) {
      throw err;
    };

    let step, error;
    stepValue.on('fail', function(obj, passedErr) {
      step = obj;
      error = passedErr;
    });

    runner.run(function() {
      assert.equal(step, stepValue);
      assert.equal(error, err);
      done();
    });
  });

  it('emits a timeout error when the timeout is exceeded', function(done) {
    stepValue.implementation = function(callback) {
      setTimeout(callback, 300);
    };

    stepValue.on('fail', function(step, error) {
      assert.equal(step.text, stepValue.text);
      assert(error.message.match(/Step timed out/i));
      done();
    });

    runner.run(function() {});
  });

  it('wraps the run in a "started" and "finished" event', function(done) {
    let events = [];
    stepValue.onAny(function(event) {
      events.push(event);
    });

    runner.run(function() {
      assert.equal(events[0], 'started');
      assert.equal(events[1], 'pass');
      assert.equal(events[2], 'finished');
      done();
    });
  });

  describe('#emit(err)', function() {
    let events;

    beforeEach(function() {
      events = [];
      stepValue.onAny(function(event) {
        events.push(event);
      });
    });

    it('when there is no error, it emits a \'pass\' on the step', function() {
      runner.emit();
      assert.equal(events[0], 'pass');
    });

    it('when there is a pending error, it emits a \'pending\' on the step', function() {
      runner.emit(new Error('Pending'));
      assert.equal(events[0], 'pending');
    });

    it('when there is a different error, it emits a \'fail\' on the step', function() {
      runner.emit(new Error('Oh crap!'));
      assert.equal(events[0], 'fail');
    });

    it('when it receives a non-error value, it emits a a \'fail\' on the step', function() {
      runner.emit('some random string');
      assert.equal(events[0], 'fail');
    });
  });
});
