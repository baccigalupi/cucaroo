'use strict';

const World           = require('./world');
const Features        = require('./features');
const StatusReport    = require('./status-report');
const compileFeatures = require('./compile-feature');

function passThrough(callback) {
  callback();
}

class SuiteRunner {
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
      this.world = new SuiteRunner.World(setupData, this.logger);
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
      return SuiteRunner.compile(feature, this.logger);
    });
  }

  runFeatures() {
    new SuiteRunner.Features(this.features, this.world).run(() => {
      this.teardownSuite();
    });
  }

  teardownSuite() {
    this.teardown(this.world, () => {
      new SuiteRunner.StatusReport(this.world.status, this.logger).print();
      this.close();
    });
  }

  close() {
    process.exit(this.world.status.exitCode());
  }
}

SuiteRunner.World    = World;
SuiteRunner.Features = Features;
SuiteRunner.compile  = compileFeatures;
SuiteRunner.StatusReport = StatusReport;

module.exports = SuiteRunner;

