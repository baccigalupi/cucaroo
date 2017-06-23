'use strict';

const assert = require('assert');

module.exports = function(world) {
  world.given('all step definitions are defined', function(done) {
    done();
  });

  world.when('I run the feature', function(done) {
    done();
  });

  world.then('I should see all steps in green', function(done) {
    done();
  });

  world.and('the exit code should be 0', function(done) {
    done();
  });

  world.given('I wrap a number of substeps into one', function(done) {
    world
      .runStep('all step definitions are defined')
      .runStep('I run the feature')
      .finish(done);
  });

  world.then('I should see everything is green', function(done) {
    world.run('I should see all steps in green', done);
  });
};
