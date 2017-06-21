'use strict';

const CollectionRunner = require('./collection-runner');
const Feature          = require('./feature');

class FeatureCollection extends CollectionRunner {
  statusId() { return 'feature'; }
}
FeatureCollection.ItemClass = Feature;

module.exports = FeatureCollection;
