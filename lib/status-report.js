'use strict';

const chalk = require('chalk');
const StepPrinter = require('./step-value-printer');

class StatusReport {
  constructor(status, logger) {
    this.status = status;
    this.logger = logger;
  }

  print() {
    this.logger.warn('------------------------------------------------');
    this.logger.addBreak();

    this.ambiguous();
    this.pending();
    this.unimplemented();
    this.logger.warn('------------------------------------------------');

    this.logger.write(this.formatSummary());
  }

  // private methods below here
  unimplemented() {
    if (!this.status.notFound.length) { return; }

    let header = 'Missing step definitions!!!';
    let description = 'You can implement step definitions with these snippets:';
    let body = this.status.notFound
      .map((step) => {
        return new StepPrinter(step, this.logger).suggestedDefinition();
      })
      .join('\n\n');

    let wrapped = `module.exports = function(world) {\n${body}\n};`;

    this.logger.error(header);
    this.logger.write(chalk.gray(description) + '\n\n');
    this.logger.warn(wrapped);
    this.logger.addBreak();
  }

  pending() {
    if (!this.status.pending.length) { return; }

    let header = 'Pending steps!!!';
    let body = this.status.pending
      .map((step) => { return `  '${step.text}'\n`; })
      .join('');
    let wrapped = `${body}`;

    this.logger.error(header);
    this.logger.warn(wrapped);
  }

  ambiguous() {
    if (!this.status.ambiguous.length) { return; }

    let header = 'Ambiguous step definitions found for these steps:';
    let body = this.status.ambiguous
      .map((step) => { return `  '${step.text}'\n`; })
      .join('');
    let wrapped = `${body}`;

    this.logger.error(header);
    this.logger.warn(wrapped);
  }

  formatSummary() {
    let header;
    if (this.status.features.fail) {
      header = chalk.red('Some features failed:');
    } else {
      header = chalk.green('All features passed!');
    }

    let body = `\n${this.formatHeaderType('Features -  ',  this.status.features)}`;
    body    += `\n${this.formatHeaderType('Scenarios - ',  this.status.scenarios)}`;
    body    += `\n${this.formatHeaderType('Steps -     ',  this.status.steps)}`;

    return `${header}\n${body}\n${this.formatErrorCounts()}`;
  }

  formatErrorCounts() {
    let formatted = '';
    if (this.status.features.fail) {
      formatted += this.formatStep('Pending',       this.status.pending.length);
      formatted += this.formatStep('Unimplemented', this.status.notFound.length);
      formatted += this.formatStep('Ambiguous',     this.status.ambiguous.length);
    }
    return formatted;
  }

  formatHeaderType(type, stats) {
    let prefix = this.formatWithColor(type);
    let passingHeader = this.formatWithColor('Passing: ') + this.formatPassing(stats.pass);
    let failingHeader = this.formatWithColor('Failing: ') + this.formatError(stats.fail);
    return `  ${prefix} ${passingHeader}, ${failingHeader}`;
  }

  formatStep(title, count) {
    return `    ${chalk.yellow(title + ':')} ${this.formatError(count)}\n`;
  }

  formatWithColor(message) {
    let color = this.status.features.fail ? 'yellow' : 'green';
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
