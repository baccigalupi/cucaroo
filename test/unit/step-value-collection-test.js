'use strict';

const assert = require('assert');
const sinon  = require('sinon');

const StepValue           = require('../../lib/step-value');
const StepValueCollection = require('../../lib/step-value-collection');

describe('StepValueCollection', function() {
  let collection, validStep, ambiguousStep, notFoundStep;

  beforeEach(function() {
    validStep = new StepValue(
      {text: 'I am the step text', keyword: 'Given'},
      [{implementation: sinon.spy()}]
    );

    ambiguousStep = new StepValue(
      {text: 'I live and breath', keyword: 'When'},
      [{implementation: sinon.spy()}, {implementation: sinon.spy()}]
    );

    notFoundStep = new StepValue(
      {text: 'I will be validated', keyword: 'Then'},
      []
    );
  });

  it('is valid if all the steps are valid', function() {
    collection = new StepValueCollection([validStep, validStep, validStep]);
    assert(collection.valid());
    collection = new StepValueCollection([validStep, ambiguousStep]);
    assert(!collection.valid());
  });

  it('returns ambiguous steps', function() {
    collection = new StepValueCollection([validStep, ambiguousStep, ambiguousStep]);
    let ambiguousSteps = collection.ambiguousSteps();
    assert.equal(ambiguousSteps.length, 2);
    assert.equal(ambiguousSteps[0], ambiguousStep);
    assert.equal(ambiguousSteps[1], ambiguousStep);
  });

  it('returns not found steps', function() {
    collection = new StepValueCollection([validStep, notFoundStep, notFoundStep]);
    let notFoundSteps = collection.notFoundSteps();
    assert.equal(notFoundSteps.length, 2);
    assert.equal(notFoundSteps[0], notFoundStep);
    assert.equal(notFoundSteps[1], notFoundStep);
  });

  it('radiates "error" events from the individual steps', function() {
    let stepListener = sinon.spy();
    let collectionListener = sinon.spy();
    collection = new StepValueCollection([validStep, validStep]);
    collection.listen(stepListener);
    collection.on('error', collectionListener);

    validStep.emit('error', 'hi');

    assert.equal(stepListener.callCount, 2);
    assert.equal(collectionListener.callCount, 2);
  });

  it('radiates "pending" events from the individual steps', function() {
    let stepListener = sinon.spy();
    let collectionListener = sinon.spy();
    collection = new StepValueCollection([validStep, validStep]);
    collection.listen(stepListener);
    collection.on('pending', collectionListener);

    validStep.emit('pending', 'hi');

    assert.equal(stepListener.callCount, 2);
    assert.equal(collectionListener.callCount, 2);
  });
});

