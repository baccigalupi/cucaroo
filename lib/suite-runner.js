'use strict';

const World           = require('./world');
const StatusReport    = require('./status-report');
const compileFeatures = require('./compile-feature');
const SuiteObserver   = require('./suite-observer');
const FeatureCollectionRunner = require('./feature-collection-runner');

function passThrough(callback) {
  callback();
}

class SuiteRunner {
  constructor(config) {
    this.timeout         = config.timeout || 3000;
    this.setup           = config.setup || passThrough;
    this.teardown        = config.teardown || passThrough;
    this.rawFeatures     = config.features;
    this.stepExports     = config.stepExports;
    this.logger          = config.logger;
    this.observer        = new SuiteObserver(config.logger);
  }

  run(){
    this.setup((setupData) => {
      setupData = setupData || {};
      this.world = new SuiteRunner.World(setupData, this.logger, this.observer);
      this.world.timeout = this.timeout;
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
    let featureRunner = new FeatureCollectionRunner(this.features, this.world);
    featureRunner.onAny((event, item, err) => {
      this.observer.handleEvent(event, item, err);
    });
    featureRunner.run(() => { this.teardownSuite(); });
  }

  teardownSuite() {
    this.teardown(this.world, () => {
      new SuiteRunner.StatusReport(this.observer.data, this.logger).print();
      this.close();
    });
  }

  close() {
    process.exit(this.observer.data.features.fail);
  }
}

SuiteRunner.World    = World;
SuiteRunner.compile  = compileFeatures;
SuiteRunner.StatusReport = StatusReport;

module.exports = SuiteRunner;

