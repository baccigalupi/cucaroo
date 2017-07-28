'use strict';

const inherits      = require('util').inherits;
const EventEmitter  = require('eventemitter2').EventEmitter2

const Collection       = require('./collection');
const Runner           = require('./runner');
const CollectionRunner = require('./collection-value-runner');
const ScenarioCollectionRunner = require('./scenario-collection-runner');

// temp
const Logger        = require('./logger');

class FeatureValue {
  constructor(compiled) {
    let feature       = compiled.document.feature || {};
    this.name         = feature.name;
    this.description  = feature.description;
    this.scenarios    = feature.children;
  }
}
FeatureValue.prototype.eventPrefix = 'feature-';
inherits(FeatureValue, EventEmitter);

class FeatureCollection extends Collection {}
FeatureCollection.ValueClass = FeatureValue;

class FeatureRunner extends Runner {
  runChildren(callback) {
    let runner = new ScenarioCollectionRunner(this.item.scenarios, this.world);
    runner.onAny((event, item, err) => {
      this.parent.emit(event, item, err);
    });
    runner.run(callback);
  }
}
FeatureRunner.prototype.eventPrefix = 'feature-';

class FeatureCollectionRunner extends CollectionRunner {}
FeatureCollectionRunner.eventPrefix          = 'feature-';
FeatureCollectionRunner.ItemRunner           = FeatureRunner;
FeatureCollectionRunner.CollectionClass      = FeatureCollection;

module.exports = FeatureCollectionRunner;
