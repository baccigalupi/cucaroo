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

  mappedCallFor(compiledFeature) {
    throw new Error('not implemented');
  }
}

module.exports = CollectionRunner;
