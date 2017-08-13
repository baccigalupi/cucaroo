'use strict';

const assert        = require('assert');
const OutputStream  = require('./support/output-stream');

const Config        = require('../../lib/config');
const Logger        = require('../../lib/logger');
const localConfig   = require('../../.cucaroo.config');

describe('Config', function() {
  let mockStream, outputStream, config;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    config        = new Config(outputStream, []);
  });

  it('should create a logger based on the output stream', function() {
    assert(config.logger instanceof Logger);
    assert.equal(config.logger.outputStream, outputStream);
  });

  it('uses the `.cucaroo.config.js` file to locate important directories', function() {
    config.load();
    let paths = config.paths();
    assert.equal(paths.features,        localConfig.featuresDirectory);
    assert.equal(paths.stepDefinitions, localConfig.stepDefinitions);
    assert.equal(paths.suiteSetup,      localConfig.suiteSetup);
    assert.equal(paths.suiteTeardown,   localConfig.suiteTeardown);
  });

  it('will resort to defaults if the config file is not found', function() {
    config.load('not-here.yo');
    let paths = config.paths();
    let base  = config.base;
    assert.equal(paths.features,        base + '/features');
    assert.equal(paths.stepDefinitions, base + '/features/step_definitions');
    assert.equal(paths.suiteSetup,      base + '/features/support/setup');
    assert.equal(paths.suiteTeardown,   base + '/features/support/teardown');
  });

  it('logs a warning if the config file is not found', function() {
    config.load('not-here.yo');
    let expectedMessage = '`.cucaroo.config.js` config file not found.';
    assert(mockStream.cleanOutput().includes(expectedMessage));
  });

  it('does not log anything if the config file is found', function() {
    config.load();
    assert.equal('', mockStream.cleanOutput());
  });

  it('should have a default timeout that is overridden by the file', function() {
    config.load();
    assert.equal(config.timeout, 200);
    config.load('not-here.yo');
    assert.equal(config.timeout, 3000);
  });

  it('should read all the features on load', function() {
    config.load();
    assert(config.features.length >= 5);
  });

  it('should require all the step definitions on load', function() {
    config.load();
    assert(config.stepExports.length >= 5);
  });

  it('requires the setup and teardown scripts', function() {
    config.load();
    let setup    = require('../features/support/setup');
    let teardown = require('../features/support/teardown');
    assert.equal(config.setup, setup);
    assert.equal(config.teardown, teardown);
  });

  describe('when passed filters', function() {
    it('when one relative file path is passed, it reduces features to that file', function() {
      config = new Config(outputStream, ['test/features/success.feature']);
      config.load();
      assert.equal(config.features.length, 1);
    });
  });
});
