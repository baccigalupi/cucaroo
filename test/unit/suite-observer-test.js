'use strict';

const assert = require('assert');
const sinon  = require('sinon');

const SuiteObserver = require('../../lib/suite-observer');

describe('SuiteObserver', function() {
  let observer, logger, step;

  beforeEach(function() {
    logger = {
      write: function() {}
    };
    observer = new SuiteObserver(logger);
    step = {
      text: 'I am a step',
      type: 'Given',
      definitionCount: 0,
      valid: function () { return true; },
      ambiguous: function () { return false; },
      notFound: function () { return false; },
    };
  });
});
