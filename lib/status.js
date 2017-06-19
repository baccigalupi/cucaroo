'use strict';

class Status {
  constructor() {
    this.passing = {
      steps: 0,
      scenarios: 0,
      features: 0
    };

    this.errors = 0;

    this.pending = [];
    this.unimplemented = [];
    this.ambiguous = [];
  }

  exitCode() {
    return this.errors +
      this.pending.length +
      this.unimplemented.length +
      this.ambiguous.length;
  }

  add(type, message) {
    if (!this[type]) { return; }
    if (this[type].some((existing) => {return existing === message})) {
      return;
    }
    this[type].push(message);
  }

  pass(type) {
    if (this.passing[type + 's'] === 0 || this.passing[type + 's'] > 0) {
      this.passing[type + 's'] += 1;
    }
  }

  failStep() {
    this.errors += 1;
  }

  has(type) {
    return !!(this[type].length);
  }

  hasAmbiguous() {
    return this.has('ambiguous');
  }

  hasPending() {
    return this.has('pending');
  }

  hasUnimplemented() {
    return this.has('pending');
  }
}

module.exports = Status;
