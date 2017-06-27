'use strict';

const async      = require('async');
const StepRunner = require('./step-runner');

class StepCollectionRunner {
  constructor(steps, world) {
    this.steps = steps;
    this.world = world;
    this.timeout = world.timeout;
    this._halted = false;
  }

  run(callback) {
    this.listen();
    async.series(this.runners(), callback);
  }

  runners() {
    return this.steps.map((step) => {
      return (next) => {
        new StepRunner(step, this, this.timeout).run(next);
      }
    });
  }

  listen() {
    this.steps.listen((event, step, err) => {
      if (event !== 'pass') {
        this._halted = true;
      }
    });
  }

  halted() {
    return this._halted;
  }
}

module.exports = StepCollectionRunner;
