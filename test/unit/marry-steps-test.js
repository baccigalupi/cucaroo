'use strict';

const assert = require('assert');

const MarrySteps = require('../../lib/marry-steps');

describe('MarrySteps', function() {
  let marry, compiledSteps, definitions;
  class MockDefinition {
    constructor(text) {
      this.text = text;
    }

    match(matchText) {
      return this.text === matchText;
    }
  }

  beforeEach(function() {
    compiledSteps = [
      {text: 'I am the step text', keyword: 'Given'},
      'I come from the land of substep',
      {text: 'I live and breath', keyword: 'When'},
      {text: 'I will be validated', keyword: 'Then'}
    ];

    definitions = [
      new MockDefinition('I am the step text'),
      new MockDefinition('I come from the land of substep'),
      new MockDefinition('I will be validated'),
      new MockDefinition('I will be validated')
    ];

    marry = new MarrySteps(compiledSteps, definitions);
  });

  it('generates the right step text values for each step', function() {
    let stepCollection = marry.marry();
    let textValues = stepCollection.map((item) => { return item.text; });
    assert.equal(textValues[0], 'I am the step text');
    assert.equal(textValues[1], 'I come from the land of substep');
    assert.equal(textValues[2], 'I live and breath');
    assert.equal(textValues[3], 'I will be validated');
  });

  it('generates the right types for each step', function() {
    let stepCollection = marry.marry();
    let value = stepCollection.map((item) => { return item.type; });
    assert.equal(value[0], 'Given');
    assert.equal(value[1], 'And');
    assert.equal(value[2], 'When');
    assert.equal(value[3], 'Then');
  });

  it('matches definitions with compiled steps', function() {
    let stepCollection = marry.marry();
    let value = stepCollection.map((item) => { return item.definitionCount; });
    assert.equal(value[0], 1);
    assert.equal(value[1], 1);
    assert.equal(value[2], 0);
    assert.equal(value[3], 2);
  });
});

