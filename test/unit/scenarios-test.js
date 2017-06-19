'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const Scenarios    = require('../../lib/scenarios');
const loadFeatures = require('../../lib/load-features');
const compile      = require('../../lib/compile-feature');

describe('Scenarios', function() {
  let runCount;
  let Scenario = function(texts, world) {
    this.compiled = texts;
    this.world = world;
    this.run = (done) => {
      runCount += 1;
      done();
    }
  }

  let compiledFeatures;

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    runCount = 0;
    Scenarios.ItemClass = Scenario;
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('calls run on each feature and then finished with the callback', function(done) {
    let world = {};
    let scenarios = new Scenarios(['one', 'two'], world);
    scenarios.run(function() {
      assert.equal(runCount, 2);
      done();
    });
  });
});
