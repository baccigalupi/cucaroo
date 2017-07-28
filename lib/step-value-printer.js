'use strict';

const chalk = require('chalk');

class StepPrinter {
  constructor(step, logger) {
    this.step = step;
    this.log = logger;
  }

  suggestedDefinition() {
    var definition = `  world.${this.step.type.toLowerCase().trim()}('${this.step.text}', function(done) {\n`;
    definition +=    '    done(world.pending());\n'
    definition +=    '  });'
    return definition;
  }

  print(event, indent='') {
    this.log.write(`${indent}${this.body(event)}${this.comment(event)}\n`);
  }

  printSub(event) {
    this.print(event, '  ');
  }

  comment(event) {
    let comment = '';
    if (this.step.ambiguous()) {
      comment += `${this.step.definitionCount} definitions exist for this step.`;
    }
    if (this.step.notFound()) {
      comment += 'no definition found for this step.';
    }
    if (event === 'pending') {
      comment += 'step is pending; halting scenario';
    }
    if (event === 'fail') {
      comment += 'step threw an error; halting scenario';
    }
    if (event === 'substep-not-run') {
      comment += 'substep could not be run'
    }
    return comment.length ? chalk.red(`  // ${comment}`) : comment;
  }

  body(event) {
    let color = this.getColor(event);
    return `     ${chalk.cyan(this.step.type)} ${chalk[color](this.step.text)}`;
  }

  getColor(event) {
    let color = 'green';
    if (event === 'fail')            { color = 'red'; }
    if (event === 'pending')         { color = 'yellow'; }
    if (event === 'not-run' ||
        event === 'substep-not-run') { color = 'gray'; }
    return color;
  }

  error(message) {
    this.log.error(message);
  }
}

module.exports = StepPrinter;

