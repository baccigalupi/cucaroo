'use strict';

const assert = require('assert');

module.exports = function(world) {
  world.given('Things are moving along just fine', function(done) {
    done();
  });

  world.when('And then I make an assertion that aint true', function(done) {
    assert(false, 'it isnt like we thought');
    done();
  });

  world.then('I should see a helpful stack trace', function(done) {
    done();
  });

  world.and('the summary at the end reflects those errors', function(done) {
    done();
  });

  world.when('I make an error resulting in a runtime failure', function(done) {
    failHard();
  });
};
