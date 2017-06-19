'use strict';

const assert       = require('assert');
const Status       = require('../../lib/status');
const StatusReport = require('../../lib/status-report');
const Logger       = require('../../lib/logger');
const OutputStream = require('./support/output-stream');

describe('StatusReport', function() {
  let status, statusReport;
  let mockStream, outputStream, logger;

  beforeEach(function() {
    mockStream      = new OutputStream();
    outputStream    = mockStream.stream;
    logger          = new Logger(outputStream);
    status          = new Status();
    statusReport    = new StatusReport(status, logger);
  });

  // eyeballing it for now, because lots of change, and tedium
  xit('prints', function() {
    status.add('unimplemented', 'where is it?');
    status.add('unimplemented', 'and more question about how');
    status.add('pending', 'not yet yo!');
    status.failStep();
    status.pass('step');

    statusReport.print();
    console.log(mockStream.output);
  });
});
