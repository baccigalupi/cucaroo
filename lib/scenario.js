'use strict';

const chalk = require('chalk');
const StepCollection = require('./step-collection');

class Scenario {
  constructor(compilation, world) {
    this.compilation = compilation;
    this.world = world;
    this.log = world.logger;
  }

  run(callback) {
    this.print();
    new Scenario.StepCollection(this.compilation.steps, this.world, this).run(callback);
    this.log.addBreak();
  }

  print() {
    this.log.scenarioName(this.compilation.name);
  }
}

Scenario.StepCollection = StepCollection;

module.exports = Scenario;
