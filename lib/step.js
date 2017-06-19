'use strict';

const chalk = require('chalk');
const StepPrinter = require('./step-printer');

class Step {
  constructor(compiled, definitions, parent) {
    this.compiled     = compiled;
    this.definitions  = definitions;
    this.definition   = definitions[0];
    this.parent       = parent;
    this.world        = this.parent.world;
    this.timeout      = this.world.timeout;
    this.status       = this.world.status;
    this.log          = new StepPrinter(this, this.world.logger);
  }

  run(done) {
    this.timer = setTimeout(() => {
      this.onError(new Error('Step timeout! done was not called for step after ', this.timeout));
      done();
    }, this.timeout);

    try {
      this.definition.implementation((err) => {
        if (err) {
          this.onError(err);
        } else {
          this.status.pass('step');
          this.log.print();
        }
        clearTimeout(this.timer);
        done();
      });
    } catch(err) {
      this.onError(err);
      clearTimeout(this.timer);
      done();
    }
  }

  onError(err) {
    if (err.message.match(/pending/i)) {
      this.onPendingError(err);
    } else {
      this.onNonPendingError(err);
    }
  }

  onPendingError() {
    this.status.add('pending', this.matchText());
    this.pending = true;
    this.parent.pending = true;
    this.print();
  }

  onNonPendingError(err) {
    this.status.failStep();
    this.error = true;
    this.parent.error = true;
    this.print();
    this.log.error(`\n${err.stack}\n`);
  }

  valid() {
    return this.definitions.length === 1;
  }

  ambiguous() {
    return this.definitions.length > 1;
  }

  notFound() {
    return this.definitions.length == 0;
  }

  type() {
    return this.compiled.keyword;
  }

  matchText() {
    return this.compiled.text;
  }

  numberDefinitions() {
    return this.definitions.length;
  }

  print(color) {
    this.log.print(color);
  }

  printImplementationSuggestion() {
    this.log.suggestedDefinition();
  }
}

module.exports = Step;
