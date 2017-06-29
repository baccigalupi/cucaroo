'use strict';

class Runner {
  constructor(item, parent, world) {
    this.item     = item;
    this.parent   = parent;
    this.world    = world;
  }

  run(done) {
    this.item.emit(`${this.eventPrefix}started`, this.item);
    this.runChildren(() => {
      this.item.emit(`${this.eventPrefix}finished`, this.item);
      done();
    });
  }

  runChildren(callback) {
    callback();
  }
}

Runner.prototype.eventPrefix = '';

module.exports = Runner;
