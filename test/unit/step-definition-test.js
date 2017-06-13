'use strict';

const assert = require('assert');
const StepDefinition = require('../../lib/step-definition');

describe('StepDefinition', function() {
  let definition, implementation, callcount;

  beforeEach(function() {
    callcount = 0;
    implementation = function(done) {
      callcount += 1;
      done();
    };
  });

  it('matching steps works when the matcher is a string', function() {
    definition = new StepDefinition('I visit to the home page', implementation, 'When');
    let matched = definition.match('I visit to the home page');
    assert(matched);
    matched = definition.match('I go to the home page');
    assert(!matched);
  });

  it('matching steps works when the matcher is a regex', function() {
    definition = new StepDefinition(/I \w+ to the home page/i, implementation, 'When');
    let matched = definition.match('i visit to the home page');
    assert(matched);
    matched = definition.match('i go to the home page');
    assert(matched);
    matched = definition.match('I click something');
    assert(!matched);
  });

  it('run() calls the implemetation', function(done) {
    definition = new StepDefinition('I visit to the home page', implementation, 'When');
    definition.run(function() {
      assert.equal(callcount, 1);
      done();
    });
  });
});
