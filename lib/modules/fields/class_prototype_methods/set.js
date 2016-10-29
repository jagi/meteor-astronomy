import {
  extend,
  isObject,
  isString
}
from 'lodash';
import setMany from '../utils/set_many.js';
import setOne from '../utils/set_one.js';
import castNested from '../utils/castNested';

function set(...args) {
  const doc = this;

  // Default options.
  const options = {
    defaults: true,
    clone: true,
    cast: false
  };

  // Setting single field.
  if (isString(args[0]) && args.length >= 2) {
    // The last argument is an options object.
    if (isObject(args[2])) {
      extend(options, args[2]);
    }
    setOne(doc, args[0], args[1], options);
  }
  // Setting multiple fields at once.
  else if (isObject(args[0]) && args.length >= 1) {
    // The last argument is an options object.
    if (isObject(args[1])) {
      extend(options, args[1]);
    }
    setMany(doc, args[0], options);
  }
};

export default set;