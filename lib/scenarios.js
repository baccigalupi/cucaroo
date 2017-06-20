'use strict';

const CollectionRunner = require('./collection-runner');
const Scenario         = require('./scenario');

class Scenarios extends CollectionRunner {
  statusId() { return 'scenario'; }
}
Scenarios.ItemClass = Scenario;

module.exports = Scenarios;
