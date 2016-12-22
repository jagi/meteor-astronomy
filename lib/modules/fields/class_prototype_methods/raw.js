import {
  isArray,
  isPlainObject,
  isString
}
from 'lodash';
import rawAll from '../utils/rawAll';
import rawMany from '../utils/rawMany';
import rawOne from '../utils/rawOne';

function raw(...args) {
  if (args.length === 0) {
    return rawAll(this);
  }
  else if (args.length >= 1) {
    if (isString(args[0])) {
      return rawOne(this, ...args);
    }
    else if (isArray(args[0])) {
      return rawMany(this, ...args);
    }
    else if (isPlainObject(args[0])) {
      return rawAll(this, ...args);
    }
  }
};

export default raw;