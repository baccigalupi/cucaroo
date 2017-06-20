'use strict';

const StepDefinitions = require('./step-definitions');
const Status          = require('./status');

class World {
  constructor(data, logger) {
    this.timeout = 3000;

    Object.keys(data).forEach((name) => {
      !this[name] && (this[name] = data[name]);
    });

    this.logger          = logger;
    this.stepDefinitions = new StepDefinitions();
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

  run(stepText, callback) {
    new RunStep().runStep(stepText).finish(callback);
  }

  runStep(stepText) {
    return new RunStep().runStep(stepText);
  }

  pending() {
    // NOTE: this should affect the status, but we need to keep the currentStep in the world
    // maybe also the current scenario and current feature
    return new Error('pending');
  }
}

class RunStep {
  constructor() {
    this.stepTexts = [];
  }

  runStep(text) {
    this.stepTexts.push(text);
    return this;
  }

  finish(callback) {
    try {
      this.runAll(callback);
    } catch(e) {
      callback(e);
    }
  }

  runAll(callback) {
    // some magic here
    callback();
  }
}

module.exports = World;
