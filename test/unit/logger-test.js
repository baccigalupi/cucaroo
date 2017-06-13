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

  it('prints out a good feature name and description', function() {
    let name = 'Signing in';
    let description = '  As a customer\n' +
                      '  I want to sign in to see subscribed content\n' +
                      '  So that I am informed\n';
    logger.featureName(name);
    logger.featureDescription(description);

    let expectedText = `\nFeature: ${name}\n${description}\n\n`;
    assert.equal(mockStream.cleanOutput(), expectedText);
  });

  it('prints out scenario names', function() {
    let name = 'Doing something great!';
    logger.scenarioName(name);
    let expectedText = '  Scenario: Doing something great!\n';
    assert.equal(mockStream.cleanOutput(), expectedText);
  });

  it('prints a break', function() {
    logger.addBreak();
    assert.equal(mockStream.cleanOutput(), '\n');
  });

  it('prints missing step declaration', function() {
    logger.stepsDefinitionsMissing();
    let expected = `\n\nMissing step definitions!!!\nYou can implement step definitions with these snippets:\n\n`;
    assert.equal(mockStream.cleanOutput(), expected);
  });
});
