'use strict';

const async   = require('async');

class CollectionRunner {
  constructor(compiled, world) {
    this.compiled = compiled;
    this.world = world;
  }

  run(done) {
    let calls = this.compiled.map((compiledFeature) => {
      return this.mappedCallFor(compiledFeature);
    });

    async.series(calls, done);
  }

  mappedCallFor(compiled) {
    return (done) => {
      new this.constructor.ItemClass(compiled, this.world).run(done);
    }
  }
}

CollectionRunner.ItemClass = function() {
  throw new Error('Not implemented. Attach the ItemClass to this CollectionRunner; k, thanks!');
}

module.exports = CollectionRunner;
