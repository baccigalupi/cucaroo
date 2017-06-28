'use strict';

const StepDefinitions = require('./step-definitions');
const Status          = require('./status');
const SubStepRunner   = require('./sub-step-runner');

class World {
  constructor(data, logger, observer) {
    Object.keys(data).forEach((name) => {
      this[name] = data[name];
    });

    this.logger          = logger;
    this.observer        = observer;
    this.stepDefinitions = new StepDefinitions();
    this.status          = new Status();
    this.bindAttrs();
  }

  bindAttrs() {
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
    let subStepRunner = new SubStepRunner(this);
    subStepRunner.onAny((event, step, err) => {
      this.observer.onSubStepEvent(event, step, err);
    });
    subStepRunner.add(stepText).finish(callback);
  }

  runStep(stepText) {
    let subStepRunner = new SubStepRunner(this);
    subStepRunner.onAny((event, step, err) => {
      this.observer.onSubStepEvent(event, step, err);
    });
    return subStepRunner.add(stepText);
  }

  pending() {
    // NOTE: this should affect the status, but we need to keep the currentStep in the world
    // maybe also the current scenario and current feature
    return new Error('pending');
  }
}

module.exports = World;
