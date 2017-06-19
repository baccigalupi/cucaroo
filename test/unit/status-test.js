'use strict';

const assert       = require('assert');
const Status       = require('../../lib/status');

describe('Status', function() {
  let status;

  beforeEach(function() {
    status = new Status();
  });

  it('starts with a success exit code', function() {
    assert.equal(status.exitCode(), 0);
  });

  it('add(\'unimplemented\', message) retains messages and affects exit code', function() {
    status.add('unimplemented', 'one');
    assert.equal(status.unimplemented[0], 'one');
    assert.equal(status.exitCode(), 1)
  });

  it('addUnimplemented(message) will not add duplicates', function() {
    status.add('unimplemented', 'one');
    status.add('unimplemented', 'one');
    assert.equal(status.unimplemented.length, 1);
    assert.equal(status.exitCode(), 1);
  });

  it('pass(type) increments the passing successes', function() {
    status.pass('step');
    status.pass('step');
    status.pass('step');
    status.pass('scenario');
    status.pass('scenario');
    status.pass('feature');

    assert.equal(status.passing.steps, 3);
    assert.equal(status.passing.scenarios, 2);
    assert.equal(status.passing.features, 1);
  });

  it('failStep() incements all the relevant parts', function() {
    status.failStep();
    assert.equal(status.errors, 1);
    assert.equal(status.exitCode(), 1);
  });
});
