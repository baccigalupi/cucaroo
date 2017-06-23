'use strict';

const assert = require('assert');
const sinon  = require('sinon');
const StepValue = require('../../lib/step-value');

describe('StepValue', function() {
  let stepValue, compiledStep, matchingDefinitions;

  beforeEach(function() {
    compiledStep = {text: 'I am the step text', keyword: 'Given'};
    matchingDefinitions = [
      { implementation: sinon.spy() }
    ];
    stepValue = new StepValue(compiledStep, matchingDefinitions);
  });

  it('makes available the most important parts of the step', function() {
    assert.equal(stepValue.text, 'I am the step text');
    assert.equal(stepValue.type, 'Given');
    assert.equal(stepValue.implementation, matchingDefinitions[0].implementation);
  });

  it('is valid with one definition', function() {
    assert(stepValue.valid());
    assert(!stepValue.ambiguous());
    assert(!stepValue.notFound());
  });

  it('is not found when there are no definitions', function() {
    matchingDefinitions = [];
    stepValue = new StepValue(compiledStep, matchingDefinitions);
    assert(!stepValue.valid());
    assert(!stepValue.ambiguous());
    assert(stepValue.notFound());
  });

  it('is ambiguous when there are multiple definitions', function() {
    matchingDefinitions.push({ implementation: sinon.spy() });
    stepValue = new StepValue(compiledStep, matchingDefinitions);
    assert(!stepValue.valid());
    assert(stepValue.ambiguous());
    assert(!stepValue.notFound());
  });

  it('is an event emitter', function() {
    let listener = sinon.spy();
    stepValue.on('error', listener);
    stepValue.emit('error', 'Mayday!');
    assert(listener.calledWith('Mayday!'));
  });
});
