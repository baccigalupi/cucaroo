'use strict';

class StepRunner {
  constructor(step, parent, world) {
    this.step     = step;
    this.world    = world;
    this.timeout  = world.timeout;
    this.parent   = parent;
  }

  run(done) {
    this.step.emit('started', this.step);
    if (this.parent.halted()) {
      this.emit();
      done();
    } else {
      this._run(done);
    }
  }

  _run(next) {
    this.timer = this.setupTimeout(next);

    try {
      this.step.implementation((err) => {
        clearTimeout(this.timer);
        this.emit(err);
        next();
      });
    } catch(err) {
      clearTimeout(this.timer);
      this.emit(err);
      next();
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
      this.step.emit('fail', this.step, err);
    }
    this.step.emit('finished', this.step);
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

