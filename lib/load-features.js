'use strict';

const path    = require('path');
const fs      = require('fs');
const fsWalk  = require('fs-walk');

module.exports = function loadFeatures(dirname) {
  let files = [];

  function handleFile(basedir, filename, stat) {
    if (path.extname(filename) !== '.feature') { return; }
    let fullPath = path.join(basedir, filename);
    files.push(fs.readFileSync(fullPath).toString());
  }

  fsWalk.walkSync(dirname, handleFile);

  return files;
};
