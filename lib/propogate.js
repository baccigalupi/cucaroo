'use strict';

module.exports = function propogate(child, parent) {
  child.onAny(function(event, obj, err) {
    parent.emit(event, obj, err);
  });
};
