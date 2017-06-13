'use strict';

const chalk = require('chalk');

class Logger {
  constructor(outputStream) {
    this.outputStream = outputStream;
  }

  warn(message) {
    this.outputStream.write(`${chalk.yellow(message)}\n`);
  }

  error(message) {
    this.outputStream.write(`${chalk.red(message)}\n`);
  }

  disabled(message) {
    this.outputStream.write(`${chalk.gray(message)}\n`);
  }

  featureName(text) {
    this.outputStream.write(`\nFeature: ${chalk.yellow(text)}\n`);
  }

  featureDescription(text) {
    this.outputStream.write(`${text}\n\n`);
  }

  scenarioName(text) {
    this.outputStream.write(`  Scenario: ${chalk.yellow(text)}\n`);
  }

  addBreak() {
    this.outputStream.write('\n');
  }

  stepsDefinitionsMissing() {
    this.addBreak();
    this.addBreak();
    this.error('Missing step definitions!!!');
    this.disabled('You can implement step definitions with these snippets:');
    this.addBreak();
  }
}

module.exports = Logger;
