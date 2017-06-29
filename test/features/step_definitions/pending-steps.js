'use strict';

module.exports = function(world) {
  world.given('The first step is pending by throwing a pending error', function(done) {
    throw world.pending();
  });

  world.given('The first step is pending by passing a pending error to the callback', function(done) {
    done(world.pending());
  });

  world.then('I throw in a pending step', function(done) {
    done(world.pending());
  });

  world.then('I should see all steps are gray', function(done) {
    done();
  });

  world.and('the exit code should be 1', function(done) {
    done();
  });
};
