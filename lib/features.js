'use strict';

const CollectionRunner = require('./collection-runner');
const Feature          = require('./feature');

class Features extends CollectionRunner {
  mappedCallFor(compiled) {
    return (done) => {
      new Features.Feature(compiled, this.world).run(done);
    }
  }
}

Features.Feature = Feature;

module.exports = Features;
