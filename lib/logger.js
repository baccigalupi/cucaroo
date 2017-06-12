'use strict';

const chalk = require('chalk');

class Logger {
  constructor(outputStream) {
    this.outputStream = outputStream;
  }

  warn(message) {
    this.outputStream.write(`${chalk.yellow(message)}\n`);
  }
}

module.exports = Logger;
