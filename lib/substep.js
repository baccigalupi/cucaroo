'use strict';

const async                 = require('async');

const MarrySteps            = require('./marry-steps');
const StepCollectionRunner  = require('./step-collection-runner');

class Substep {
  constructor(world) {
    this.stepTexts = [];
    this.world = world;
    this.definitions = world.stepDefinitions;
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
    let steps = new MarrySteps(this.stepTexts, this.definitions.steps).marry();
    new StepCollectionRunner(steps, this).run(callback);
  }
}

module.exports = Substep;
