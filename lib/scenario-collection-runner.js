'use strict';

const inherits      = require('util').inherits;
const EventEmitter  = require('eventemitter2').EventEmitter2

const Collection       = require('./collection');
const Runner           = require('./runner');
const CollectionRunner = require('./collection-value-runner');
const MarrySteps       = require('./marry-steps');
const StepCollectionRunner = require('./step-collection-runner');

let eventPrefix = 'scenario-'

class ScenarioValue {
  constructor(compiled) {
    this.name         = compiled.name;
    this.steps        = compiled.steps;
  }
}
inherits(ScenarioValue, EventEmitter);

class ScenarioCollection extends Collection {}
ScenarioCollection.ValueClass = ScenarioValue;

class ScenarioRunner extends Runner {
  runChildren(callback) {
    let steps  = new MarrySteps(this.item.steps, this.world.stepDefinitions.steps).marry();
    let runner = new StepCollectionRunner(steps, this.world);
    runner.onAny((event, item, err) => {
      this.parent.emit(`step-${event}`, item, err);
    });
    runner.run(callback);
  }
}
ScenarioRunner.prototype.eventPrefix = eventPrefix;

class ScenarioCollectionRunner extends CollectionRunner {}
ScenarioCollectionRunner.ItemRunner             = ScenarioRunner;
ScenarioCollectionRunner.CollectionClass        = ScenarioCollection;

module.exports = ScenarioCollectionRunner;
