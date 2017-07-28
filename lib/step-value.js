'use strict';

const inherits      = require('util').inherits;
const EventEmitter  = require('eventemitter2').EventEmitter2

class StepValue {
  constructor(compiled, definitions) {
    this.text = compiled.text;
    this.type = compiled.keyword;
    this.definitionCount = definitions.length;
    this.implementation = definitions.length && definitions[0].implementation;
  }

  valid() {
    return this.definitionCount === 1;
  }

  ambiguous() {
    return this.definitionCount > 1;
  }

  notFound() {
    return this.definitionCount == 0;
  }
}

inherits(StepValue, EventEmitter);

module.exports = StepValue;
