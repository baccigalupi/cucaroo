'use strict';

const assert        = require('assert');
const OutputStream  = require('./support/output-stream');

const Config        = require('../../lib/config');
const localConfig   = require('../../.cucaroo.config');

describe('Config', function() {
  let mockStream, outputConsole, config;

  beforeEach(function() {
    mockStream = new OutputStream();
    outputConsole = mockStream.stream;
    config = new Config(outputConsole);
  });

  it('should use the passed in output stream', function() {
    assert.equal(config.outputStream, outputConsole)
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
    let expectedMessage = '`cucaroo.config.js` config file not found.';
    assert(mockStream.cleanOutput().includes(expectedMessage));
  });

  it('does not log anything if the config file is found', function() {
    config.load();
    assert.equal('', mockStream.cleanOutput());
  });

  it('should have a default timeout that is overridden by the file', function() {
    config.load();
    assert.equal(config.timeout, 5000);
    config.load('not-here.yo');
    assert.equal(config.timeout, 3000);
  });

  it('should read all the features on load', function() {
    config.load();
    assert(config.features.length >= 1);
  });

  it('should require all the step definitions on load', function() {
    config.load();
    assert(config.stepDefinitions.length >= 1);
  });
});
