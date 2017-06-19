'use strict';

const chalk = require('chalk');

class StatusReport {
  constructor(logger) {
    this.logger = logger;

    this.passing = {
      steps: 0,
      scenarios: 0,
      features: 0
    };

    this.errors = 0;

    this.pending = [];
    this.unimplemented = [];
    this.ambiguous = [];
  }

  exitCode() {
    return this.errors +
      this.pending.length +
      this.unimplemented.length +
      this.ambiguous.length;
  }

  add(type, message) {
    if (!this[type]) { return; }
    if (this[type].some((existing) => {return existing === message})) {
      return;
    }
    this[type].push(message);
  }

  pass(type) {
    if (this.passing[type + 's'] === 0 || this.passing[type + 's'] > 0) {
      this.passing[type + 's'] += 1;
    }
  }

  failStep() {
    this.errors += 1;
  }

  implementationReport() {
    let body = this.unimplemented.join('  \n\n');
    let wrapped = `module.exports = function(world) {
  ${body}
};`;
    let header = 'Missing step definitions!!!';
    let description = 'You can implement step definitions with these snippets:';
    this.logger.error(header);
    this.logger.write(chalk.gray(description) + '\n');
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  pendingReport() {
    let header = 'Pending steps!!!';
    let body = this.pending.join('\`  \n\`');
    let wrapped = `  '${body}'`;
    this.logger.error(header);
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  ambiguousReport() {
    let header = 'Ambiguous step definitions found for these steps:';
    let body = this.ambiguous.join('\`  \n\`');
    let wrapped = `  '${body}'`;
    this.logger.error(header);
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  print() {
    this.logger.addBreak();
    this.ambiguous.length     && this.ambiguousReport();
    this.pending.length       && this.pendingReport();
    this.unimplemented.length && this.implementationReport();
    this.logger.write(this.formatSummary());
  }

  formatSummary() {
    let errorCount = this.errors;
    let header = !errorCount ? chalk.green('All features passed!') : chalk.red('Some features failed:');

    let body = `
  ${this.formatWithColor('Features:  passing')} ${this.formatPassing(this.passing.features)}, ${this.formatWithColor('failing:')} ${this.formatError(errorCount)}
  ${this.formatWithColor('Scenarios: passing')} ${this.formatPassing(this.passing.scenarios)}, ${this.formatWithColor('failing:')} ${this.formatError(errorCount)}
  ${this.formatWithColor('Steps:\n    Passing:')} ${this.formatPassing(this.passing.steps)}\n`;

    let errors = chalk.yellow(`    Failing: ${this.formatError(errorCount)}
    Pending: ${this.formatError(this.pending.length)}
    Unimplemented: ${this.formatError(this.unimplemented.length)}
    Ambiguous: ${this.formatError(this.ambiguous.length)}`);

    let combined = `${header}
 ${body}`;
    if (errorCount) { combined += errors; }
    return combined;
  }

  formatWithColor(message) {
    let color = this.errors ? 'yellow' : 'green';
    return chalk[color](message)
  }

  formatPassing(number) {
    let color = number ? 'green' : 'grey';
    return chalk[color](number)
  }

  formatError(number) {
    let color = number ? 'red' : 'grey';
    return chalk[color](number);
  }
}

module.exports = StatusReport;
