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
    assert.equal(world.errors, 0);
    done();
  });
};
