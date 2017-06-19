'use strict';

const CollectionRunner = require('./collection-runner');
const Feature          = require('./feature');

class Features extends CollectionRunner {}
Features.ItemClass = Feature;

module.exports = Features;
