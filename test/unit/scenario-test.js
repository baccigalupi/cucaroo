'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const Scenario      = require('../../lib/scenario');
const OutputStream  = require('./support/output-stream');
const Logger        = require('../../lib/logger');

describe('Feature', function() {
  let scenarioText, scenario, mockStream, outputStream, logger, callCount;

  let StepCollection = function() {
    this.run = function(callback) {
      callCount += 1;
      callback();
    };
  };

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    callCount     = 0;
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    logger        = new Logger(outputStream);

    scenarioText = {
      name: 'Doing great things',
    };
    Scenario.StepCollection = StepCollection;

    scenario = new Scenario(scenarioText, {logger: logger});
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('.run() calls run on a new Steps instance', function(done) {
    scenario.run(function() {
      assert.equal(callCount, 1);
      done();
    });
  });

  it('.run() prints the scenario', function(done) {
    scenario.run(function() {
      assert(mockStream.cleanOutput().length);
      done();
    });
  });
});
