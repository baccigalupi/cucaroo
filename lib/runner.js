'use strict';

const World             = require('./world');
const FeatureCollection = require('./feature-collection');
const StatusReport      = require('./status-report');
const compileFeatures   = require('./compile-feature');

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
      this.world = new Runner.World(setupData, this.logger);
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
    new Runner.FeatureCollection(this.features, this.world).run(() => {
      this.teardownSuite();
    });
  }

  teardownSuite() {
    this.teardown(this.world, () => {
      new Runner.StatusReport(this.world.status, this.logger).print();
      this.close();
    });
  }

  close() {
    process.exit(this.world.status.exitCode());
  }
}

Runner.World    = World;
Runner.FeatureCollection = FeatureCollection;
Runner.compile  = compileFeatures;
Runner.StatusReport = StatusReport;

module.exports = Runner;
