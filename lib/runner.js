'use strict';

const World           = require('./world');
const Features        = require('./features');
const compileFeatures = require('./compile-feature');

function passThrough(callback) {
  callback();
}

class Runner {
  constructor(config) {
    this.setup           = config.setup || passThrough;
    this.teardown        = config.teardown || passThrough;
    this.rawFeatures     = config.features;
    this.stepExports     = config.stepExports;
    this.logger          = config.logger;
  }

  run(){
    this.setup((setupData) => {
      setupData = setupData || {};
      this.world = new Runner.World(setupData);
      this.world.logger = this.logger;
      this.injectDefinitionsIntoWorld();
      this.compileFeatures();
      this.runFeatures();
    });
  }

  injectDefinitionsIntoWorld() {
    Object.keys(this.stepExports).forEach((key) => {
      this.stepExports[key](this.world);
    });
  }

  compileFeatures() {
    this.features  = this.rawFeatures.map((feature) => {
      return Runner.compile(feature, this.logger);
    });
  }

  runFeatures() {
    new Runner.Features(this.features, this.world).run(() => { this.teardownSuite(); });
  }

  teardownSuite() {
    this.teardown(this.world, () => { this.close(); });
  }

  close() {
    process.exit(this.world.errors);
  }
}

Runner.World    = World;
Runner.Features = Features;
Runner.compile  = compileFeatures;

module.exports = Runner;

