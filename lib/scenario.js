'use strict';

const chalk = require('chalk');
const Steps = require('./steps');

class Scenario {
  constructor(compilation, world) {
    this.compilation = compilation;
    this.world = world;
    this.log = world.logger;
  }

  run(callback) {
    this.print();
    new Scenario.Steps(this.compilation.steps, this.world).run(callback);
    this.log.addBreak();
  }

  print() {
    this.log.scenarioName(this.compilation.name);
  }
}

Scenario.Steps = Steps;

module.exports = Scenario;
