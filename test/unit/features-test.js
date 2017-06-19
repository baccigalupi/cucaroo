'use strict';

const assert       = require('assert');
const sinon        = require('sinon');

const Features     = require('../../lib/features');
const loadFeatures = require('../../lib/load-features');
const compile      = require('../../lib/compile-feature');

describe('Features', function() {
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
    Features.ItemClass = Feature;
    compiledFeatures = loadFeatures(__dirname + '/../features').map((featureText) => {
      return compile(featureText, console);
    });
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('calls run on each feature and then finished with the callback', function(done) {
    let world = {};
    let features = new Features(compiledFeatures, world);
    features.run(function() {
      assert.equal(runCount, compiledFeatures.length);
      done();
    });
  });
});
