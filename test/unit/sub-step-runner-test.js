'use strict';

const assert  = require('assert');
const World   = require('../../lib/world');
const SubStepRunner = require('../../lib/sub-step-runner');

describe('SubStepRunner', function() {
  let subStep, world;

  beforeEach(function() {
    world   = new World({}, {});
    subStep = new SubStepRunner(world);
  });

  it('add("step text") adds the step text to an array', function() {
    subStep.add('Hello, world');
    assert.equal(subStep.stepTexts[0], 'Hello, world');
  });

  it('add("step text") returns the subStep for chaining', function() {
    assert.equal(subStep.add('whatever'), subStep);
  });

  it('finish(done) marries and runs the substeps capturing "not-run" when step not found', function(done) {
    subStep.add('more o that!');

    subStep.on('substep-not-run', function(step) {
      assert(step.notFound());
      done();
    });

    subStep.finish(function() {});
  });

  it('finish(done) captures "pass" events', function() {
    world.given('more o that!', function(callback) {
      callback();
    });

    subStep.on('pass', function(step) {
      assert.equal(step.text, 'more o that!');
      done();
    });

    subStep.add('more o that!');
    subStep.finish(function() {});
  });

  it('finish(done) captures "not-run" events when ambiguous steps', function() {
    world.given('more o that!', function(callback) {
      callback();
    });

    world.given('more o that!', function(callback) {
      callback();
    });

    subStep.on('not-run', function(step) {
      assert(step.ambpiguous());
      done();
    });

    subStep.add('more o that!');
    subStep.finish(function() {});
  });

  it('finish(done) captures "pending" events when that happens', function() {
    world.given('more o that!', function(callback) {
      throw new Error('pending');
      callback();
    });

    subStep.on('pending', function(step) {
      assert.equal(step.text, 'more o that!');
      done();
    });

    subStep.add('more o that!');
    subStep.finish(function() {});
  });

  it('finish(done) captures "fail" events when that happens', function() {
    world.given('more o that!', function(callback) {
      throw new Error('bang!');
      callback();
    });

    subStep.on('fail', function(step) {
      assert.equal(step.text, 'more o that!');
      done();
    });

    subStep.add('more o that!');
    subStep.finish(function() {});
  });
});
