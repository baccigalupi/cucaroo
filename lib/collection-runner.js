'use strict';

const async   = require('async');

class CollectionRunner {
  constructor(compiled, world) {
    this.compiled = compiled;
    this.world    = world;
    this.status   = world.status;
  }

  run(done) {
    this.collection = this.buildCollection();

    let calls = this.collection.map((item) => {
      return (next) => { item.run(next); };
    });

    async.series(calls, () => {
      if (this.collection.every((item) => { return !item.pending && !item.error; })) {
        this.status.pass(this.statusId());
      }
      done();
    });
  }

  buildCollection() {
    return this.compiled.map((compiledItem) => {
      return new this.constructor.ItemClass(compiledItem, this.world);
    });
  }

  statusId() {
    throw new Error('Not implemented');
  }
}

CollectionRunner.ItemClass = function() {
  throw new Error('Not implemented. Attach the ItemClass to this CollectionRunner; k, thanks!');
}

module.exports = CollectionRunner;
