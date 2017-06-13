'use strict';

const assert = require('assert');
const sinon  = require('sinon');

const Runner = require('../../lib/runner');
const Logger = require('../../lib/runner');
const OutputStream  = require('./support/output-stream');

describe('Runner', function() {
  let config, runner;
  let mockStream, outputStream;

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    mockStream = new OutputStream();
    outputStream = mockStream.stream;
    let logger = new Logger(outputStream);

    config = {
      features: [],
      stepDefinitions: {},
      timeout: 3000,
      setup: sinon.spy(),
      teardown: sinon.spy(),
      logger: logger
    };
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('.run() calls setup in config', function() {
    runner = new Runner(config);
    runner.run();
    assert(config.setup.called);
  });

  it('.run() after setup it creates a world with data from the setup', function() {
    config.setup = function(callback) {
      callback({some: 'stuff'});
    };

    runner = new Runner(config);
    runner.run();
    assert.equal(runner.world.some, 'stuff');
    assert.equal(runner.world.logger, config.logger);
  });

  it('.run() after setup processes definitions with its world', function() {
    config.setup = function(callback) {
      callback();
    };

    config.stepDefinitions = {
      hello: sinon.spy()
    };

    runner = new Runner(config);
    runner.run();
    assert(config.stepDefinitions.hello.calledWith(runner.world));
  });

  it('.run() after setup compiles the features and runs them', function() {
    config.setup = function(callback) {
      callback();
    };
    config.teardown = sinon.spy();
    config.features = ['feature']

    Runner.compile = sinon.spy();
    Runner.Features = class Features {
      run(callback) {
        callback();
      }
    }
    runner = new Runner(config);
    runner.run();
    assert(Runner.compile.calledWith('feature'));
    assert(config.teardown.called);
  });
});
