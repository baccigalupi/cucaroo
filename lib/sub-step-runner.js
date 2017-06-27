'use strict';

const async                 = require('async');
const inherits              = require('util').inherits;
const EventEmitter          = require('eventemitter2').EventEmitter2;

const propogate             = require('./propogate');
const MarrySteps            = require('./marry-steps');
const StepCollectionRunner  = require('./step-collection-runner');

class SubStepRunner {
  constructor(world) {
    this.stepTexts = [];
    this.world = world;
    this.definitions = world.stepDefinitions;
  }

  add(text) {
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
    let steps  = new MarrySteps(this.stepTexts, this.definitions.steps).marry();
    let runner = new StepCollectionRunner(steps, this);
    propogate(steps, this);
    runner.run(callback);
  }
}

SubStepRunner.prototype.runStep = SubStepRunner.prototype.add;

inherits(SubStepRunner, EventEmitter);

SubStepRunner.MarrySteps           = MarrySteps;
SubStepRunner.StepCollectionRunner = StepCollectionRunner;

module.exports = SubStepRunner;
