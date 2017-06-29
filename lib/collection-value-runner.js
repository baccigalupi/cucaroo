'use strict';

const async         = require('async');
const inherits      = require('util').inherits;
const EventEmitter  = require('eventemitter2').EventEmitter2

class CollectionRunner {
  constructor(items, world) {
    this.collection = this.wrap(items);
    this.world = world;
    this._halted = this.initialHaltCondition();
  }

  run(callback) {
    this.listen();
    async.series(this.runners(), callback);
  }

  runners() {
    return this.collection.map((item) => {
      return (next) => {
        new this.constructor.ItemRunner(item, this, this.world).run(next);
      }
    });
  }

  listen() {
    this.collection.listen((event, item, err) => {
      if (event === 'fail' || event === 'pending' || event === 'not-run') {
        this._halted = true;
      }
      this.emit(`${this.eventPrefix}${event}`, item, err);
    });
  }

  halted() {
    return this._halted;
  }

  initialHaltCondition() {
    return false;
  }

  wrap(items) {
    return new this.constructor.CollectionClass(items)
  }
}

inherits(CollectionRunner, EventEmitter);

CollectionRunner.prototype.eventPrefix = '';

CollectionRunner.ItemRunner = function() {
  throw new Error('Not implemented. Attach the ItemRunner to this CollectionRunner; k, thanks!');
};

CollectionRunner.CollectionClass = function() {
  throw new Error('Not implemented. Attach the CollectionClass to this CollectionRunner; k, thanks!');
};

module.exports = CollectionRunner;

