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

  handleEvent(event, item, err) {
    let method = event.replace(/-([a-z])/g, (match) => { return match[1].toUpperCase(); });
    this[method] && this[method](item, err);
  }

  featureStarted(item) {
    this.featurePassing = true;
    this.logger.featureName(item.name);
    this.logger.featureDescription(item.description);
  }

  featureFinished(item) {
    if (this.featurePassing) {
      this.data.features.pass += 1;
    } else {
      this.data.features.fail += 1;
    }
  }

  scenarioStarted(item) {
    this.scenarioPassing = true;
    this.logger.scenarioName(item.name);
  }

  scenarioFinished(item) {
    if (this.scenarioPassing) {
      this.data.scenarios.pass += 1;
    } else {
      this.data.scenarios.fail += 1;
    }
    this.logger.addBreak();
  }

  stepStarted(item) {
    this.currentStep = item;
  }

  stepPass(item) {
    this.data.steps.pass += 1;
    this.printStep(item);
  }

  stepFail(item, err) {
    this.featurePassing = this.scenarioPassing = false;
    this.data.steps.fail += 1;

    this.printStep(item, 'fail');
    this.logger.addBreak();
    this.logger.error(err.stack);
    this.logger.addBreak();
  }

  stepNotRun(item) {
    this.featurePassing = this.scenarioPassing = false;
    this.printStep(item, 'not-run');
  }

  stepPending(item) {
    this.featurePassing = this.scenarioPassing = false;
    this.printStep(item, 'pending');
  }

  substepNotRun(item, err) {
    if (!item.ambiguous() && !item.notFound()) { return; }

    if (this.currentStep !== this.subParent) {
      this.printStep(this.currentStep, 'substep-not-run');
    }
    this.printStep(item, 'not-run', true);
    this.subParent = this.currentStep;
  }

  printStep(step, event, sub=false) {
    if      (step.ambiguous())    { this.data.ambiguous.push(step); }
    else if (step.notFound())     { this.data.notFound.push(step); }
    else if (event === 'pending') { this.data.pending.push(step); }
    let printMethod = sub ? 'printSub' : 'print';
    new SuiteObserver.StepPrinter(step, this.logger)[printMethod](event);
  }
}

SuiteObserver.StepPrinter = StepPrinter;

module.exports = SuiteObserver;
