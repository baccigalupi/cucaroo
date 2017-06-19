'use strict';

const chalk = require('chalk');

class StepPrinter {
  constructor(step, logger) {
    this.step = step;
    this.log = logger;
  }

  suggestedDefinition() {
    this.log.warn(`  world.${this.step.type().toLowerCase().trim()}('${this.step.matchText()}', function(done) {`);
    this.log.warn('    done(world.pending());');
    this.log.warn('  });');
  }

  print(color) {
    this.log.write(`${this.body(color)}${this.comment()}\n`);
  }

  comment() {
    let comment = '';
    if (this.step.ambiguous()) {
      comment += `${this.step.numberDefinitions()} definitions exist for this step.`;
    }
    if (this.step.notFound()) {
      comment += 'no definition found for this step.';
    }
    if (this.step.pending) {
      comment += 'step is pending; halting scenario';
    }
    if (this.step.error) {
      comment += 'step threw an error; halting scenario';
    }
    return comment.length ? chalk.red(`  // ${comment}`) : comment;
  }

  body(color) {
    color = color || this.getColor();
    return `     ${chalk.cyan(this.step.type())} ${chalk[color](this.step.matchText())}`;
  }

  isError() {
    return !this.step.valid() || this.step.error;
  }

  getColor() {
    let color = 'green';
    if (this.isError()) { color = 'red'; };
    if (this.step.pending)   { color = 'yellow'; };
    return color;
  }

  error(message) {
    this.log.error(message);
  }
}

module.exports = StepPrinter;

