'use stict';

const chalk     = require('chalk');
const ScenarioCollection = require('./scenario-collection');

class Feature {
  constructor(compiled, world) {
    this.compiled = compiled.document.feature;
    this.world = world;
    this.log = world.logger;
  }

  run(callback) {
    this.print();
    new Feature.ScenarioCollection(this.compiled.children, this.world).run(callback);
  }

  print() {
    this.log.featureName(this.compiled.name);
    this.log.featureDescription(this.compiled.description);
  }
}

Feature.ScenarioCollection = ScenarioCollection;

module.exports = Feature;
