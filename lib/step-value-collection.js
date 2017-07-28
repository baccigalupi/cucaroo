'use strict';

const inherits      = require('util').inherits;
const EventEmitter  = require('eventemitter2').EventEmitter2

class StepValueCollection {
  constructor(collection) {
    this.collection = collection;
  }

  valid() {
    return this.collection.every((item) => { return item.valid(); });
  }

  ambiguousSteps() {
    return this.collection.filter((item) => { return item.ambiguous(); });
  }

  notFoundSteps() {
    return this.collection.filter((item) => { return item.notFound(); });
  }

  map(iterator) {
    return this.collection.map(iterator);
  }

  listen(listener) {
    this.collection.forEach((item) => {
      item.onAny((event, item, err) => {
        this.emit(event, item, err);
        listener(event, item, err);
      });
    });
  }
}

inherits(StepValueCollection, EventEmitter);

module.exports = StepValueCollection;

