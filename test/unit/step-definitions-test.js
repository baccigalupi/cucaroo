'use strict';

const assert = require('assert');
const StepDefinitions = require('../../lib/step-definitions');

describe('StepDefinitions', function() {
  let definitions, callcount, implementation;

  beforeEach(function() {
    callcount = 0;
    implementation = function(done) {
      callcount += 1;
      done();
    };
    definitions = new StepDefinitions();
  });

  it('allows adding step definitions via special names', function() {
    definitions.given('I rise in the morning', implementation);
    definitions.when('I make coffee', implementation);
    definitions.and('I drink the coffee', implementation);
    definitions.then('I will feel good', implementation);

    assert.equal(definitions.size(), 4);
    let types = definitions.steps.map((def) => {return def.type;});
    assert.equal(types[0], 'Given');
    assert.equal(types[1], 'When');
    assert.equal(types[2], 'When');
    assert.equal(types[3], 'Then');
  });

  it('returns matches', function() {
    definitions.given('I go to the home page', implementation);
    definitions.when('I wander away', implementation);
    definitions.and(/I \w+ to the home page/, implementation);
    definitions.then('I will feel good', implementation);

    let matches = definitions.matches('I navigate to the home page');
    assert.equal(matches.length, 1);

    matches = definitions.matches('I go to the home page');
    assert.equal(matches.length, 2);

    matches = definitions.matches('oh not here!');
    assert.equal(matches.length, 0);
  });
});
