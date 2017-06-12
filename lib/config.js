'use strict';

const path  = require('path');
const chalk = require('chalk');
const requireDirectory = require('require-directory');

const getFeatures = require('./get-features');

class Config {
  constructor(outputStream) {
    this.outputStream = outputStream;
    this.base = process.cwd();
  }

  load(configPath) {
    this.configPath = configPath || path.resolve(this.base, './.cucaroo.config.js');
    this.loadFromConfigFile();
    this.loadFeatureFiles();
    this.loadDefinitions();
  }

  loadFromConfigFile() {
    this.fileAttributes = {};
    try {
      this.fileAttributes = this.remap(require(this.configPath));
    } catch(e) {
      this.warn('`cucaroo.config.js` config file not found. Using default values.\n');
    }

    this.timeout = this.fileAttributes.timeout || this.defaultTimeout();
  }

  loadFeatureFiles() {
    this.features = [];
    try {
      this.features = getFeatures(this.paths().features);
    } catch(e) {
      this.warn(e.stack);
    }
  }

  loadDefinitions() {
    this.stepDefinitions = [];
    try {
      let fileMap = requireDirectory(module, this.paths().stepDefinitions);
      this.stepDefinitions = Object.keys(fileMap).map((filename) => {
        return fileMap[filename];
      });
    } catch(e) {
      this.warn(e.stack);
    }
  }

  remap(attributes) {
    return Object.assign(attributes, {
      features: attributes.featuresDirectory
    });
  }

  paths() {
    return Object.assign(this.defaultPaths(), this.fileAttributes);
  }

  defaultPaths() {
    let featuresDirectory = path.resolve(this.base, 'features');
    return {
      features:           featuresDirectory,
      suiteSetup:         featuresDirectory + '/support/setup',
      suiteTeardown:      featuresDirectory + '/support/teardown',
      stepDefinitions:    featuresDirectory + '/step_definitions'
    };
  }

  defaultTimeout() {
    return 3000;
  }

  warn(message) {
    this.outputStream.write(chalk.yellow(message));
  }
}

module.exports = Config;
