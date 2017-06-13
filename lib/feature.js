'use stict';

const chalk     = require('chalk');
const Scenarios = require('./scenarios');

class Feature {
  constructor(compiled, world) {
    this.compiled = compiled.document.feature;
    this.world = world;
    this.log = world.logger;
  }

  run(callback) {
    this.print();
    new Feature.Scenarios(this.compiled.children, this.world).run(callback);
  }

  print() {
    this.log.featureName(this.compiled.name);
    this.log.featureDescription(this.compiled.description);
  }
}

Feature.Scenarios = Scenarios;

module.exports = Feature;
