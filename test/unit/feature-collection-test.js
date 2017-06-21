'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const FeatureCollection = require('../../lib/feature-collection');
const loadFeatures      = require('../../lib/load-features');
const compile           = require('../../lib/compile-feature');

describe('FeatureCollection', function() {
  let runCount;
  let Feature = function(featureText, world) {
    this.compiled = featureText;
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
    FeatureCollection.ItemClass = Feature;
    compiledFeatures = loadFeatures(__dirname + '/../features').map((featureText) => {
      return compile(featureText, console);
    });
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('calls run on each feature and then finished with the callback', function(done) {
    let world = {status: {pass: sinon.spy()}};
    let features = new FeatureCollection(compiledFeatures, world);
    features.run(function() {
      assert.equal(runCount, compiledFeatures.length);
      assert(world.status.pass.calledWith('feature'));
      done();
    });
  });
});
