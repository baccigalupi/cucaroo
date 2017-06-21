'use strict';

const CollectionRunner = require('./collection-runner');
const Scenario         = require('./scenario');

class ScenarioCollection extends CollectionRunner {
  statusId() { return 'scenario'; }
}
ScenarioCollection.ItemClass = Scenario;

module.exports = ScenarioCollection;
