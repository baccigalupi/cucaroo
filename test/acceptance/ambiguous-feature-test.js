'use strict';

const assert = require('assert');
const OutputStream  = require('../unit/support/output-stream');

const Config        = require('../../lib/config');
const Runner        = require('../../lib/suite-runner');

describe('failure.feature', function() {
  let config, runner, mockStream, outputStream, exitCode;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    config        = new Config(outputStream, ['test/features/failure.feature']);
    config.load();
  });

  it('returns an error code', function(done) {
    Runner.prototype.close = function() {
      assert.equal(this.observer.exitCode(), 1);
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs the feature header', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Feature with a whole lot of errors'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs scenario info', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Scenario: Assertion failure'));
      assert(plainOutput.includes('Scenario: Runtime errors'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Prints comments about which steps are unimplemented', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('When  And then I make an assertion that aint true  // step threw an error; halting scenario'));
      assert(plainOutput.includes('When  I make an error resulting in a runtime failure  // step threw an error; halting scenario'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Spits out stacktraces', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('AssertionError: it isnt like we thought'));
      assert(plainOutput.includes('ReferenceError: failHard is not defined'));
      assert(plainOutput.includes('at StepValue.implementation'));
      assert(plainOutput.includes('test/features/step_definitions/failing-steps.js:24:5'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Summarizes correctly', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Some features failed:'));
      assert(plainOutput.includes('Features -   Passing: 0, Failing: 1'));
      assert(plainOutput.includes('Scenarios -  Passing: 0, Failing: 2'));
      assert(plainOutput.includes('Steps -      Passing: 2, Failing: 2'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });
});
