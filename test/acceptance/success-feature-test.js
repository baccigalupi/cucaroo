'use strict';

const assert = require('assert');
const OutputStream  = require('../unit/support/output-stream');

const Config        = require('../../lib/config');
const Runner        = require('../../lib/suite-runner');

describe('success.feature', function() {
  let config, runner, mockStream, outputStream, exitCode;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    config        = new Config(outputStream, ['test/features/success.feature']);
    config.load();
  });

  it('runs successfully', function(done) {
    Runner.prototype.close = function() {
      assert.equal(this.observer.exitCode(), 0);
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs the feature header', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Feature: Successful feature runs'));
      assert(plainOutput.includes('As a BDD developer'));
      assert(plainOutput.includes('I want to implement and run cucumber tests'));
      assert(plainOutput.includes('So that I have regression testing, and a starting place for talking with product people'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Outputs the scenario information', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('Scenario: All is good'));
      assert(plainOutput.includes('Given  all step definitions are defined'));
      assert(plainOutput.includes('When  I run the feature'));
      assert(plainOutput.includes('And  the exit code should be 0'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });

  it('Spits out a success summary', function(done) {
    Runner.prototype.close = function() {
      let plainOutput = mockStream.cleanOutput();
      assert(plainOutput.includes('All features passed!'));
      assert(plainOutput.includes('Features -   Passing: 1, Failing: 0'));
      assert(plainOutput.includes('Scenarios -  Passing: 1, Failing: 0'));
      assert(plainOutput.includes('Steps -      Passing: 4, Failing: 0'));
      done();
    };
    runner = new Runner(config);
    runner.run();
  });
});
