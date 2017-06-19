'use strict';

const assert       = require('assert');
const StatusReport = require('../../lib/status-report');
const Logger       = require('../../lib/logger');
const OutputStream    = require('./support/output-stream');

describe('StatusReport', function() {
  let statusReport;
  let mockStream, outputStream, logger;

  beforeEach(function() {
    mockStream      = new OutputStream();
    outputStream    = mockStream.stream;
    logger          = new Logger(outputStream);
    statusReport    = new StatusReport(logger);
  });

  it('starts with a success exit code', function() {
    assert.equal(statusReport.exitCode(), 0);
  });

  it('add(\'unimplemented\', message) retains messages and affects exit code', function() {
    statusReport.add('unimplemented', 'one');
    statusReport.implementationReport();
    let expectedBody = 'module.exports = function(world) {\n  one\n};'
    assert(mockStream.cleanOutput().includes(expectedBody));
    assert.equal(statusReport.exitCode(), 1)
  });

  it('addUnimplemented(message) will not add duplicates', function() {
    statusReport.add('unimplemented', 'one');
    statusReport.add('unimplemented', 'one');
    assert.equal(statusReport.exitCode(), 1);
  });

  it('pass(type) increments the passing successes', function() {
    statusReport.pass('step');
    statusReport.pass('step');
    statusReport.pass('step');
    statusReport.pass('scenario');
    statusReport.pass('scenario');
    statusReport.pass('feature');

    assert.equal(statusReport.passing.steps, 3);
    assert.equal(statusReport.passing.scenarios, 2);
    assert.equal(statusReport.passing.features, 1);
  });

  it('failStep() incements all the relevant parts', function() {
    statusReport.failStep();
    assert.equal(statusReport.errors, 1);
    assert.equal(statusReport.exitCode(), 1);
  });
});
