'use strict';

const StepDefinitions = require('./step-definitions');

class World {
  constructor(data) {
    this.timeout = 3000;

    Object.keys(data).forEach((name) => {
      !this[name] && (this[name] = data[name]);
    });

    this.stepDefinitions = new StepDefinitions();
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
