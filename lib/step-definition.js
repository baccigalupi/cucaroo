'use strict';

class StepDefinition {
  constructor(matcher, implementation, type) {
    this.matcher = matcher;
    this.implementation = implementation;
    this.type = type;
  }

  match(text) {
    return text.match(this.matcher)
  }

  run(done) {
    this.implementation(done);
  }
}

module.exports = StepDefinition;
