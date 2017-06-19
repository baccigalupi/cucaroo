'use strict';

const chalk = require('chalk');
const async = require('async');
const Step  = require('./step');

class Steps {
  constructor(compiled, world) {
    this.compiled = compiled;
    this.world    = world;
    this.status   = world.status;
    this.log      = world.logger;
    this.definitions = world.stepDefinitions;
  }

  run(done) {
    this.collection = this.marry();
    let valid = this.collection.every((step) => { return step.valid(); });
    let callback = () => {
      this.updateScenarioStatus();
      this.log.addBreak();
      done();
    };

    if (!valid) {
      this.runInvalidSteps(callback);
    } else {
      let runs = this.collection.map((step) => {
        return (next) => { this.runStepUnlessHalted(step, next); }
      });
      async.series(runs, callback);
    }
  }

  runInvalidSteps(done) {
    this.printInvalidSteps();
    this.reportMissingSteps();
    this.reportAmbiguousSteps();
    done();
  }

  isHalted() {
    return this.pending || this.error;
  }

  runStepUnlessHalted(step, done) {
    if (this.isHalted()) {
      step.print('gray');
      return done();
    }

    step.run(done);
  }

  marry() {
    return this.compiled.map((compiledStep) => {
      let matchingDefinitions = this.definitions.matches(compiledStep.text);
      return new Steps.Step(compiledStep, matchingDefinitions, this);
    });
  }

  printInvalidSteps() {
    this.collection.forEach((step) => {
      step.print('gray');
    });
  }

  reportMissingSteps() {
    this.collection.filter((step) => { return step.notFound(); }).forEach((step) => {
      this.status.add('unimplemented', step.log.suggestedDefinition());
    });
  }

  reportAmbiguousSteps() {
    this.collection.filter((step) => { return step.ambiguous(); }).forEach((step) => {
      this.status.add('ambiguous', step.matchText());
    });
  }

  updateScenarioStatus() {
    if (!this.isHalted()) {
      this.status.pass('scenario');
    }
  }
}

Steps.Step = Step;

module.exports = Steps;
