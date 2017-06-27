'use strict';

const async               = require('async');

const StepValue           = require('./step-value');
const StepValueCollection = require('./step-value-collection');
const MarrySteps          = require('./marry-steps');
const StepRunner          = require('./step-runner');

class Substep {
  constructor(definitions, timeout) {
    this.definitions = definitions;
    this.stepTexts = [];
    this.timeout = timeout;
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
    steps.timeout = this.timeout;
    new StepsRunner(steps, timeout).run(callback);
  }
}

class StepsRunner {
  constructor(steps) {
    this.steps = steps;
    this.status = {
      valid: steps.valid(),
      pending: 0,
      errors: 0
    };
    this.pending = [];
    this.error = [];
  }

  run(callback) {
    this.listen();
    let runners = this.steps.map((step) => {
      return (next) => {
        new StepRunner(step, this, this.timeout).run(next);
      }
    });
    async.series(runners, () => {
      callback();
    });
  }

  listen() {
    this.steps.listen((event, data) => {
      this.status[event] && (this.status[event] += 1);
      this[event] && this[event].push(data);
    });
  }

  halted() {
    return this.status.valid &&
      !this.status.pending &&
      !this.status.errors;
  }
}

module.exports = Substep;
