'use strict';

const assert = require('assert');

module.exports = function(world) {
  world.given('I wrap a number of substeps into one', function(done) {
    world
      .runStep('all step definitions are defined')
      .runStep('I run the feature')
      .finish(done);
  });

  world.then('I should see everything is green', function(done) {
    world.run('I should see all steps in green', done);
  });

  world.given('I wrap an unimplemented substep into another step set', function(done) {
    world
      .runStep('all step definitions are defined')
      .runStep('not hear mo-fo!')
      .finish(done);
  });

  world.when('I run that scenario', function(done) {
    done();
  });

  world.then('I will see that the step containing the substep will be unimplemented', function(done) {
    done();
  });

  world.then('the scenario will fail', function(done) {
    done();
  });
};
