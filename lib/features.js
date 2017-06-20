'use strict';

const CollectionRunner = require('./collection-runner');
const Feature          = require('./feature');

class Features extends CollectionRunner {
  statusId() { return 'feature'; }
}
Features.ItemClass = Feature;

module.exports = Features;
