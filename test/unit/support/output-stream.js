'use strict';

const Stream = require('stream');

class MockOutputStream {
  constructor() {
    this.output = '';
    this.stream = new Stream.Writable();
    this.stream._write = (chunk, encoding, next) => {
      this.write(chunk, encoding, next);
    }
  }

  write(chunk, encoding, next) {
    this.output += chunk.toString();
    next();
  }

  cleanOutput() {
    return this.output.replace(/\x1b[[0-9;]+m/g, '');
  }
}

module.exports = MockOutputStream;
