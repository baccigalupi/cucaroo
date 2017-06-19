'use strict';

const assert       = require('assert');
const sinon        = require('sinon');
const chalk        = require('chalk');

const Step         = require('../../lib/step');
const StepPrinter  = require('../../lib/step-printer');
const Logger       = require('../../lib/logger');

const OutputStream    = require('./support/output-stream');
const compiledFeature = require('./support/sample-compiled-feature');

describe('StepPrinter', function() {
  let runCount, compiledStep, stepDefinitions, step, stepPrinter,
      mockStream, outputStream, logger;

  beforeEach(function() {
    mockStream      = new OutputStream();
    outputStream    = mockStream.stream;
    logger          = new Logger(outputStream);

    compiledStep    = compiledFeature.document.feature.children[0].steps[0];
    stepDefinitions = ['one definition'];
    step            = new Step(compiledStep, stepDefinitions, {world: {logger: logger}});
    stepPrinter     = new StepPrinter(step, logger);
  });

  it('print() when all is good the step type with the match text in green', function() {
    stepPrinter.print();
    assert(mockStream.output.includes('Given'));
    assert(mockStream.output.includes('I am a registered user'));
    assert(mockStream.output.includes(chalk.styles.cyan.open));
    assert(mockStream.output.includes(chalk.styles.green.open));
  });

  it('comment() when all is good is empty', function() {
    stepPrinter.comment();
    assert.equal(mockStream.output.length, 0);
  });

  it('print() when too many definitions found prints in error color with a comment', function() {
    step.definitions.push('two definitions');
    stepPrinter.print();
    assert(mockStream.output.includes('Given'));
    assert(mockStream.output.includes('I am a registered user'));
    assert(mockStream.output.includes('// 2 definitions exist for this step.'));
    assert(mockStream.output.includes(chalk.styles.cyan.open)); // Given
    assert(mockStream.output.includes(chalk.styles.red.open)); // match text
  });

  it('print() correct colors and messages no definitions', function() {
    step.definitions = [];
    stepPrinter.print();
    assert(mockStream.output.includes('Given'));
    assert(mockStream.output.includes('I am a registered user'));
    assert(mockStream.output.includes('// no definition found for this step.'));
    assert(mockStream.output.includes(chalk.styles.cyan.open)); // Given
    assert(mockStream.output.includes(chalk.styles.red.open)); // match text
  });

  it('print() correct colors and messages when step is pending', function() {
    step.pending = true;
    stepPrinter.print();
    assert(mockStream.output.includes('Given'));
    assert(mockStream.output.includes('I am a registered user'));
    assert(mockStream.output.includes('// step is pending; halting scenario'));
    assert(mockStream.output.includes(chalk.styles.cyan.open)); // Given
    assert(mockStream.output.includes(chalk.styles.red.open));  // comment
    assert(mockStream.output.includes(chalk.styles.yellow.open)); // match text
  });

  it('print() correct colors and messages when step is pending', function() {
    step.error = true;
    stepPrinter.print();
    assert(mockStream.output.includes('Given'));
    assert(mockStream.output.includes('I am a registered user'));
    assert(mockStream.output.includes('// step threw an error; halting scenario'));
    assert(mockStream.output.includes(chalk.styles.cyan.open)); // Given
    assert(mockStream.output.includes(chalk.styles.red.open));  // comment and match text
  });

  it('suggestedDefinition() prints a module body suggestion', function() {
    let definition = stepPrinter.suggestedDefinition();
    let expected = `  world.given('I am a registered user', function(done) {\n    done(world.pending());\n  });`
    assert.equal(definition, expected);
  });
});
