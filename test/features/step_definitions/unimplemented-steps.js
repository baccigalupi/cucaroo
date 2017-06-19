'use strict';

module.exports = function(world) {
  world.then('I should see all tests in gray', function(done) {
    done();
  });

  world.then('I should see implementation suggestions at the very end', function(done) {
    done();
  });

  world.and('I should only see the implementation suggestion once per step', function(done) {
    done();
  });
};
