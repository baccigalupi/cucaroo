'use strict';

const CollectionRunner = require('./collection-runner');
const Scenario         = require('./scenario');

class Scenarios extends CollectionRunner {
  mappedCallFor(compiled) {
    return (done) => {
      new Scenarios.Scenario(compiled, this.world).run(done);
    }
  }
}

Scenarios.Scenario = Scenario;

module.exports = Scenarios;
