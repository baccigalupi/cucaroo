'use strict';

const StepValue = require('./step-value');
const StepValueCollection = require('./step-value-collection');

class MarrySteps {
  constructor(stepCompilations, definitions) {
    this.compilations = stepCompilations;
    this.definitions  = definitions;
  }

  normalizeSteps() {
    let compilations = this.compilations.map((compilation) => {
      if (compilation.text) { return compilation; }
      return { text: compilation, keyword: 'And' };
    });
    return compilations;
  }

  marry() {
    let compilations = this.normalizeSteps();
    let stepItems = this.stepItems(compilations);
    return new StepValueCollection(stepItems);
  }

  stepItems(compilations) {
    return compilations.map((compiled) => {
      let definitions = this.findDefinitions(compiled);
      return new StepValue(compiled, definitions);
    });
  }

  findDefinitions(compiledStep) {
    return this.definitions.filter((definition) => {
      return definition.match(compiledStep.text);
    });
  }
}

module.exports = MarrySteps;
