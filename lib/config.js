'use strict';

const path  = require('path');
const chalk = require('chalk');

class Config {
  constructor(outputStream) {
    this.outputStream = outputStream;
    this.base = process.cwd();
  }

  load(configPath) {
    this.configPath = configPath || path.resolve(this.base, './.cucaroo.config.js');
    this.loadFromFile();
  }

  loadFromFile() {
    this.fileAttributes = {};
    try {
      this.fileAttributes = this.remap(require(this.configPath));
    } catch(e) {
      this.outputStream.write(chalk.yellow('.cucaroo.config.js config file not found. Using default values.'));
    }

    this.timeout = this.fileAttributes.timeout || this.defaultTimeout();
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
}

module.exports = Config;
