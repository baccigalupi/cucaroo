'use strict';

const assert = require('assert');
const OutputStream  = require('../unit/support/output-stream');

const Config        = require('../../lib/config');
const Runner        = require('../../lib/suite-runner');

describe('pending.feature', function() {
  let config, runner, mockStream, outputStream, exitCode;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    config        = new Config(outputStream, ['test/features/pending.feature']);
    config.load();
  });

  it('runs successfully', function(done) {
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
      assert(plainOutput.includes('Feature with pending steps'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Prints comments about which step is pending', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Given  The first step is pending by throwing a pending error  // step is pending; halting scenario'));
      assert(plainOutput.includes('Given  The first step is pending by passing a pending error to the callback  // step is pending; halting scenario'));
      assert(plainOutput.includes('When  I throw in a pending step  // step is pending; halting scenario'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs each scenario info', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Scenario: Pending via thrown error'));
      assert(plainOutput.includes('Scenario: First step is pending via passing an error to the callback'));
      assert(plainOutput.includes('Scenario: Later step is pending'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Spits out pending step summary', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Pending steps!!!'));
      assert(plainOutput.includes('\'The first step is pending by throwing a pending error\''));
      assert(plainOutput.includes('\'The first step is pending by passing a pending error to the callback\''));
      assert(plainOutput.includes('\'I throw in a pending step\''));
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
      assert(plainOutput.includes('Scenarios -  Passing: 0, Failing: 3'));
      assert(plainOutput.includes('Steps -      Passing: 1, Failing: 0'));
      assert(plainOutput.includes('Pending: 3'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });
});
