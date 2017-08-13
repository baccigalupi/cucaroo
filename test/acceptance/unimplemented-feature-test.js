'use strict';

const assert = require('assert');
const OutputStream  = require('../unit/support/output-stream');

const Config        = require('../../lib/config');
const Runner        = require('../../lib/suite-runner');

describe('ambiguous.feature', function() {
  let config, runner, mockStream, outputStream, exitCode;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    config        = new Config(outputStream, ['test/features/ambiguous.feature']);
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
      assert(plainOutput.includes('Feature with ambiguous steps'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs scenario info', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Scenario: There are ambiguous steps'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Prints comments about which step is ambiguous', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('And  there are two steps with the same text  // 2 definitions exist for this step.'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Spits out ambiguous step summary', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Ambiguous step definitions found for these steps:'));
      assert(plainOutput.includes('\'there are two steps with the same text\''));
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
      assert(plainOutput.includes('Scenarios -  Passing: 0, Failing: 1'));
      assert(plainOutput.includes('Steps -      Passing: 0, Failing: 0'));
      assert(plainOutput.includes('Ambiguous: 1'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });
});
