'use strict';

class StepRunner {
  constructor(step, parent, timeout) {
    this.step     = step;
    this.timeout  = timeout;
    this.parent   = parent;
  }

  run(next) {
    if (this.parent.halted()) {
      this.emit();
      return next();
    }
    this._run(next);
  }

  _run(next) {
    this.timer = this.setupTimeout(next);

    let onStepRun = (err) => {
      this.emit(err);
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
    if (this.parent.halted()) {
      this.step.emit('not-run', this.step);
    } else if (!err) {
      this.step.emit('pass', this.step);
    } else if (err.message.match(/pending/i)) {
      this.step.emit('pending', this.step);
    } else {
      this.step.emit('error', this.step, err);
    }
  }

  setupTimeout(callback) {
    return setTimeout(() => {
      let err =  new Error(`Step timed out after ${this.timeout}ms.`);
      this.emit(err);
      callback();
    }, this.timeout);
  }
}

module.exports = StepRunner;

