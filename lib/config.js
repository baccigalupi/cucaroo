'use strict';

const path  = require('path');
const chalk = require('chalk');
const requireDirectory = require('require-directory');

const loadFeatures = require('./load-features');

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
    this.timeout = this.fileAttributes.timeout || this.defaultTimeout();
  }

  loadFromConfigFile() {
    this.fileAttributes = {};
    let message = '`cucaroo.config.js` config file not found. Using default values.'
    this.tryOrWarn(() => {
      this.fileAttributes = this.remap(require(this.configPath));
    }, message);
  }

  loadFeatureFiles() {
    this.features = [];
    this.tryOrWarn(() => {
      this.features = loadFeatures(this.paths().features);
    });
  }

  loadDefinitions() {
    this.stepDefinitions = [];
    this.tryOrWarn(() => {
      let fileMap = requireDirectory(module, this.paths().stepDefinitions);
      this.stepDefinitions = Object.keys(fileMap).map((filename) => {
        return fileMap[filename];
      });
    });
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
    this.outputStream.write(chalk.yellow(message) + '\n');
  }

  tryOrWarn(block, message) {
    try {
      block();
    } catch(e) {
      this.warn(message || e.stack);
    }
  }
}

module.exports = Config;
