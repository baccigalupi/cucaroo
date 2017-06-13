'use strict';

const chalk = require('chalk');

class Logger {
  constructor(outputStream) {
    this.outputStream = outputStream;
  }

  warn(message) {
    this.outputStream.write(`${chalk.yellow(message)}\n`);
  }

  featureName(text) {
    this.outputStream.write(`\nFeature: ${chalk.yellow(text)}\n`);
  }

  featureDescription(text) {
    this.outputStream.write(`${text}\n\n`);
  }
}

module.exports = Logger;
