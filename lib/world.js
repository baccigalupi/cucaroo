'use strict';

const StepDefinitions = require('./step-definitions');
const StatusReport    = require('./status-report');

class World {
  constructor(data, logger) {
    this.timeout = 3000;

    Object.keys(data).forEach((name) => {
      !this[name] && (this[name] = data[name]);
    });

    this.logger          = logger;
    this.stepDefinitions = new StepDefinitions();
    this.statusReport    = new StatusReport(logger);
    this.bindAdders();

    this.errors = 0;
  }

  bindAdders() {
    ['given', 'when', 'then', 'and'].forEach((method) => {
      this[method] = World.prototype[method].bind(this);
    });
  }

  given() {
    this.stepDefinitions.given.apply(this.stepDefinitions, arguments);
  }

  when() {
    this.stepDefinitions.when.apply(this.stepDefinitions, arguments);
  }

  then() {
    this.stepDefinitions.then.apply(this.stepDefinitions, arguments);
  }

  and() {
    this.stepDefinitions.and.apply(this.stepDefinitions, arguments);
  }

  pending() {
    return new Error('pending');
  }

  addError() {
    this.errors += 1;
  }
}

module.exports = World;
