'use strict';

const assert        = require('assert');
const OutputStream  = require('./support/output-stream');

const Logger        = require('../../lib/logger');

describe('Logger', function() {
  let mockStream, outputStream, logger;

  beforeEach(function() {
    mockStream    = new OutputStream();
    outputStream  = mockStream.stream;
    logger        = new Logger(outputStream);
  });

  it('.warn(message) ends the message in a line break', function() {
    logger.warn('Oh no!');
    assert(mockStream.output.match(/\n$/));
  });

  it('.warn(message) formats the message in color', function() {
    logger.warn('Oh no!');
    assert(mockStream.output.match(/\x1b[[0-9;]+m/));
  });

  it('.warn(message) includes the passed in message', function() {
    logger.warn('Oh no!');
    assert(mockStream.output.match(/Oh no!/));
  });
});
