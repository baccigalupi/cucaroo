'use strict';

const StepPrinter = require('./step-value-printer');

class SuiteObserver {
  constructor(logger) {
    this.logger = logger;
    this.data = {
      features: {
        pass: 0, fail: 0
      },
      scenarios: {
        pass: 0, fail: 0
      },
      steps: {
        pass: 0, fail: 0
      },
      pending:   [],
      notFound:  [],
      ambiguous: []
    };
  }

  listenToSubSteps(subSteps) {
    subSteps.onAny((event, step, err) => {
      this.onSubStepEvent(event, step, err);
    });
  }

  onSubStepEvent(event, step, err) {
    if (event === 'not-run') {
      if      (step.ambiguous())    { this.data.ambiguous.push(step); }
      else if (step.notFound())     { this.data.notFound.push(step); }
    } else if (event === 'pending') { this.data.pending.push(step); }
  }

  onStepEvent(event, step, err) {
    this.onSubStepEvent(event, step, err);

    if (this.data.steps[event] !== undefined) {
      this.data.steps[event] += 1;
    }

    if (event === 'started')  { this.currentStep = step; }
    if (event === 'finished') { this.currentStep = undefined; }

    new SuiteObserver.StepPrinter(step, this.logger).print();
  }
}

SuiteObserver.StepPrinter = StepPrinter;

module.exports = SuiteObserver;
