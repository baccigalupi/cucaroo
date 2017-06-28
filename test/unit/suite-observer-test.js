'use strict';

const assert = require('assert');
const sinon  = require('sinon');

const SuiteObserver = require('../../lib/suite-observer');

describe('SuiteObserver', function() {
  let observer, logger, step;

  beforeEach(function() {
    logger = {
      write: function() {}
    };
    observer = new SuiteObserver(logger);
    step = {
      text: 'I am a step',
      type: 'Given',
      definitionCount: 0,
      valid: function () { return true; },
      ambiguous: function () { return false; },
      notFound: function () { return false; },
    };
  });

  describe('onSubStepEvent(event, step, err)', function() {
    it('when event is pass, does not increment the pass count', function() {
      observer.onSubStepEvent('pass', step);
      assert.equal(observer.data.steps.pass, 0);
    });

    it('when event is fail, does not increment the fail count', function() {
      observer.onSubStepEvent('fail', step, new Error('huh?'));
      assert.equal(observer.data.steps.fail, 0);
    });

    it('when event is pending, pushes the step into the pending data', function() {
      observer.onSubStepEvent('pending', step);
      assert.equal(observer.data.pending[0], step);
    });

    it('when event is not-run and ambiguous, pushes the step into the ambiguous data', function() {
      step.ambiguous = function() { return true; }
      step.notFound = function() { return false; }
      observer.onSubStepEvent('not-run', step);
      assert.equal(observer.data.ambiguous[0], step);
    });

    it('when event is not-run and not found, pushes the step into the not found data', function() {
      step.ambiguous = function() { return false; }
      step.notFound = function() { return true; }
      observer.onSubStepEvent('not-run', step);
      assert.equal(observer.data.notFound[0], step);
    });
  });

  describe('onStepEvent(event, step, err)', function() {
    it('when event is pass, increments the pass count', function() {
      observer.onStepEvent('pass', step);
      assert.equal(observer.data.steps.pass, 1);
    });

    it('when event is fail, increments the fail count', function() {
      observer.onStepEvent('fail', step, new Error('huh?'));
      assert.equal(observer.data.steps.fail, 1);
    });

    it('when event is pending, pushes the step into the pending data', function() {
      observer.onStepEvent('pending', step);
      assert.equal(observer.data.pending[0], step);
    });

    it('when event is not-run and ambiguous, pushes the step into the ambiguous data', function() {
      step.ambiguous = function() { return true; }
      step.notFound = function() { return false; }
      observer.onStepEvent('not-run', step);
      assert.equal(observer.data.ambiguous[0], step);
    });

    it('when event is not-run and not found, pushes the step into the not found data', function() {
      step.ambiguous = function() { return false; }
      step.notFound = function() { return true; }
      observer.onStepEvent('not-run', step);
      assert.equal(observer.data.notFound[0], step);
    });

    it('tells the step printer to print the event', function() {
      let sinonSandbox = sinon.sandbox.create();
      function MockPrinter() {};
      SuiteObserver.StepPrinter = MockPrinter;
      MockPrinter.prototype.print = sinon.spy();

      observer.onStepEvent('pass', step);
      assert(MockPrinter.prototype.print.called);
      sinonSandbox.restore();
    });

    it('sets the currentStep if event is "started"', function() {
      observer.onStepEvent('started', step);
      assert.equal(observer.currentStep, step);
    });

    it('clears the currentStep if the event is "finished"', function() {
      observer.currentStep = step;
      observer.onStepEvent('finished', step);
      assert.equal(observer.currentStep, undefined);
    });
  });
});
