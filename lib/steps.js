'use strict';

const chalk = require('chalk');
const async = require('async');
const Step  = require('./step');

class Steps {
  constructor(compiled, world) {
    this.compiled = compiled;
    this.world = world;
    this.log   = world.logger;
    this.definitions = world.stepDefinitions;
  }

  run(done) {
    this.collection = this.marry();
    let valid = this.collection.every((step) => { return step.valid(); });

    if (!valid) {
      this.runInvalidSteps(done);
    } else {
      let runs = this.collection.map((step) => {
        return (done) => { this.runStepUnlessHalted(step, done); }
      });
      async.series(runs, done);
    }
  }

  runInvalidSteps(done) {
    this.printInvalidSteps();
    this.printMissingSteps();
    this.printAmbiguousSteps();
    done();
  }

  runStepUnlessHalted(step, done) {
    if (this.pending || this.error) {
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

  printMissingSteps() {
    let missingSteps = this.collection.filter((step) => { return step.notFound(); });
    if (missingSteps.length) {
      this.log.stepsDefinitionsMissing();
      missingSteps.forEach((step) => {
        step.printImplementationSuggestion();
      });
    }
  }

  printAmbiguousSteps() {
    if (this.collection.every((step) => { return step.ambiguous(); })) {
      this.log.error('Some of the steps are ambiguous, and the scenario has been halted!');
    }
  }
}

Steps.Step = Step;

module.exports = Steps;
