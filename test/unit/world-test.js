'use strict';

const assert       = require('assert');
const World        = require('../../lib/world');

describe('World', function() {
  let world;

  beforeEach(function() {
    world = new World({
      hello: 'yup, world!',
      foo: 'bar',
      baz: 'zardoz'
    });
  });

  it('injects all the attributes from the initialization into the object', function() {
    assert.equal(world.hello, 'yup, world!');
    assert.equal(world.foo, 'bar');
    assert.equal(world.baz, 'zardoz');
  });

  it('starts with no errors', function() {
    assert.equal(world.errors, 0);
  });

  it('adds steps definitions via methods', function() {
    world.given(function givenStep(done) { done(); });
    world.when(function  whenStep(done) { done(); });
    world.then(function  thenStep(done) { done(); });
    world.and(function   andStep(done) { done(); });

    assert.equal(world.stepDefinitions.steps.length, 4);
  });

  it('adds errors', function() {
    world.addError();
    assert.equal(world.errors, 1);
  });
});
