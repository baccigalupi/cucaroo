'use strict';

const async            = require('async');
const StepRunner       = require('./step-runner');
const CollectionRunner = require('./collection-value-runner');

class StepCollectionRunner extends CollectionRunner {
  initialHaltCondition() {
    return !this.collection.valid();
  }

  wrap(items) {
    return items;
  }
}

StepCollectionRunner.ItemRunner = StepRunner;

module.exports = StepCollectionRunner;
