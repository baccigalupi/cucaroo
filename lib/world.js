'use strict';

const StepDefinitionCollection = require('./step-definition-collection');
const Status                   = require('./status');

class World {
  constructor(data, logger) {
    this.timeout = 3000;

    Object.keys(data).forEach((name) => {
      !this[name] && (this[name] = data[name]);
    });

    this.logger          = logger;
    this.stepDefinitionCollection = new StepDefinitionCollection();
    this.status          = new Status();
    this.bindAdders();

    this.errors = 0;
  }

  bindAdders() {
    ['given', 'when', 'then', 'and'].forEach((method) => {
      this[method] = World.prototype[method].bind(this);
    });
  }

  given() {
    this.stepDefinitionCollection.given.apply(this.stepDefinitionCollection, arguments);
  }

  when() {
    this.stepDefinitionCollection.when.apply(this.stepDefinitionCollection, arguments);
  }

  then() {
    this.stepDefinitionCollection.then.apply(this.stepDefinitionCollection, arguments);
  }

  and() {
    this.stepDefinitionCollection.and.apply(this.stepDefinitionCollection, arguments);
  }

  pending() {
    // NOTE: this should affect the status, but we need to keep the currentStep in the world
    // maybe also the current scenario and current feature
    return new Error('pending');
  }
}

module.exports = World;
