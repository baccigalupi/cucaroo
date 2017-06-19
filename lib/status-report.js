'use strict';

const chalk = require('chalk');

class StatusReport {
  constructor(status, logger) {
    this.status = status;
    this.logger = logger;
  }

  print() {
    this.logger.addBreak();

    this.ambiguous();
    this.pending();
    this.unimplemented();

    this.logger.write(this.formatSummary());
  }

  // private methods below here

  unimplemented() {
    if (!this.status.hasUnimplemented()) { return; }

    let body = this.status.unimplemented.join('\n\n');
    let wrapped = `module.exports = function(world) {\n${body}\n};`;
    let header = 'Missing step definitions!!!';
    let description = 'You can implement step definitions with these snippets:';

    this.logger.error(header);
    this.logger.write(chalk.gray(description) + '\n\n');
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  pending() {
    if (!this.status.hasPending()) { return; }

    let header = 'Pending steps!!!';
    let body = this.status.pending.join('\'  \n\'');
    let wrapped = `  '${body}'`;

    this.logger.error(header);
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  ambiguous() {
    if (!this.status.hasAmbiguous()) { return; }

    let header = 'Ambiguous step definitions found for these steps:';
    let body = this.ambiguous.join('\`  \n\`');
    let wrapped = `  '${body}'`;

    this.logger.error(header);
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  formatSummary() {
    let header;
    if (this.status.hasErrors()) {
      header = chalk.red('Some features failed:');
    } else {
      header = chalk.green('All features passed!');
    }

    let passing = this.status.passing;
    let errorCount = this.status.errorCount();

    let body = `\n${this.formatHeaderType('Features -  ',   passing.features, errorCount)}`;
    body    += `\n${this.formatHeaderType('Scenarios - ',  passing.scenarios, errorCount)}`;
    body    += `\n${this.formatHeaderType('Steps -     ',      passing.steps, errorCount)}`;

    return `${header}\n${body}\n${this.formatErrorCounts()}`;
  }

  formatErrorCounts() {
    let formatted = '';
    if (this.status.hasErrors()) {
      formatted += `\n`;
      formatted += this.formatStep('Failing',       this.status.errorCount());
      formatted += this.formatStep('Pending',       this.status.pendingCount());
      formatted += this.formatStep('Unimplemented', this.status.unimplementedCount());
      formatted += this.formatStep('Ambiguous',     this.status.ambiguousCount());
    }
    return formatted;
  }

  formatHeaderType(type, passing, failing) {
    let prefix = this.formatWithColor(type);
    let passingHeader = this.formatWithColor('Passing: ') + this.formatPassing(passing);
    let failingHeader = this.formatWithColor('Failing: ') + this.formatError(failing);
    return `  ${prefix} ${passingHeader}, ${failingHeader}`;
  }

  formatStep(title, count) {
    return `    ${chalk.yellow(title + ':')} ${this.formatError(count)}\n`;
  }

  formatWithColor(message) {
    let color = this.status.hasErrors() ? 'yellow' : 'green';
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
