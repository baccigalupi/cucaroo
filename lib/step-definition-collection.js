'use strict';

const StepDefinition = require('./step-definition');

class StepDefinitionCollection {
  constructor() {
    this.steps = [];
  }

  add(matcher, implementation, type) {
    type && (this.currentType = type);
    this.steps.push(new StepDefinition(matcher, implementation, type || this.currentType));
  }

  given(matcher, implementation) {
    this.add(matcher, implementation, 'Given');
  }

  when(matcher, implementation) {
    this.add(matcher, implementation, 'When');
  }

  then(matcher, implementation) {
    this.add(matcher, implementation, 'Then');
  }

  and(matcher, implementation) {
    this.add(matcher, implementation);
  }

  size() {
    return this.steps.length;
  }

  matches(text) {
    return this.steps.filter((step) => { return step.match(text); });
  }
}

module.exports = StepDefinitionCollection;
