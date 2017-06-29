'use strict';

const assert = require('assert');

module.exports = function(world) {
  world.given('there are two steps with the same text', function(done) {
    done();
  });

  world.given('there are two steps with the same text', function(done) {
    done();
  });

  world.when('I should see a message after the step', function(done) {
    done();
  });
};
