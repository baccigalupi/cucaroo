'use strict';

const inherits      = require('util').inherits;
const EventEmitter  = require('events').EventEmitter;
const async         = require('async');

const StepValue           = require('./step-value');
const StepValueCollection = require('./step-value-collection');

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
    new StepsRunner(steps).run(callback);
  }
}

// Creates steps from compiled steps and definitions
class MarrySteps {
  constructor(stepCompilations, definitions) {
    this.compilations = stepCompilations;
    this.definitions  = definitions;
  }

  normalizeSteps() {
    let compilations = this.compilations.map((compilation) => {
      if (compilation.text) { return compilation; }
      return { text: compilation, keyword: 'And' };
    });
    return compilations;
  }

  marry() {
    let compilations = this.normalizeSteps();

    let stepItems = compilations.map((compiled) => {
      let definitions = this.definitions.filter((definition) => {
        return definition.match(compiled.text);
      });
      return new StepValue(compiled, definitions);
    });

    return new StepValueCollection(stepItems);
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

class StepRunner {
  constructor(step, parent, timeout) {
    this.step     = step;
    this.timeout  = timeout;
    this.parent   = parent;
  }

  run(next) {
    if (this.parent.halted()) {
      this.step.emit('not-run');
      return next();
    }
    this.run(next);
  }

  _run(next) {
    this.timer = this.setupTimeout(next);

    let onStepRun = (err) => {
      if (err) { this.emit(err); }
      clearTimeout(this.timer);
      next();
    };

    try {
      this.step.implementation(onStepRun);
    } catch(err) {
      onStepRun(err);
    }
  }

  emit(err) {
    if (err.message.match(/pending/i)) {
      this.step.emit('pending', this.step);
    } else {
      this.step.emit('error', err);
    }
  }

  setupTimeout(callback) {
    return setTimeout(() => {
      let err =  new Error(`Step timed out after ${this.timeout}ms.`);
      this.step.emit('error', err);
      callback();
    }, this.timeout);
  }
}

module.exports = Substep;
