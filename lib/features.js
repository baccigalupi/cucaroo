'use strict';

const CollectionRunner = require('./collection-runner');
const Feature          = require('./feature');

class Features extends CollectionRunner {
  mappedCallFor(compiled) {
    return (done) => {
      new Feature(compiled, this.world).run(done);
    }
  }
}

module.exports = Features;
