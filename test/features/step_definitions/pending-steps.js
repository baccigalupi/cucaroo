'use strict';

module.exports = function(world) {
  world.given('I the first step is pending', function(done) {
    done(world.pending());
  });

  world.then('I should see all steps are gray', function(done) {
    done();
  });

  world.and('the exit code should be 1', function(done) {
    done();
  });
};
