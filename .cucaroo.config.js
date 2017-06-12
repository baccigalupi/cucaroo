'use strict';

const path = require('path');
const featuresDirectory = path.resolve(__dirname, './test/features')

module.exports = {
  featuresDirectory:  featuresDirectory,
  stepDefinitions:    featuresDirectory + '/step_definitions',
  suiteSetup:         featuresDirectory + '/support/setup',
  suiteTeardown:      featuresDirectory + '/support/teardown',
  timeout:            5000
};
