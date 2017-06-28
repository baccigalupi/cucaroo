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

  print(event) {
    this.log.write(`${this.body(event)}${this.comment(event)}\n`);
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
    return comment.length ? chalk.red(`  // ${comment}`) : comment;
  }

  body(event) {
    let color = this.getColor(event);
    return `     ${chalk.cyan(this.step.type)} ${chalk[color](this.step.text)}`;
  }

  getColor(event) {
    let color = 'green';
    if (event === 'fail')    { color = 'red'; };
    if (event === 'pending') { color = 'yellow'; };
    return color;
  }

  error(message) {
    this.log.error(message);
  }
}

module.exports = StepPrinter;

