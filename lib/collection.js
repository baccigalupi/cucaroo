'use strict';

class Collection {
  constructor(items) {
    this.collection = items.map((item) => {
      return new this.constructor.ValueClass(item);
    });
  }

  listen(listener) {
    this.collection.forEach((item) => {
      item.onAny((event, item, err) => {
        listener(event, item, err);
      });
    });
  }

  map(iterator) {
    return this.collection.map(iterator);
  }
}

Collection.ValueClass = function() {
  throw new Error('Not implemented. Attach the ValueClass to this Collection; k, thanks!');
}

module.exports = Collection;
