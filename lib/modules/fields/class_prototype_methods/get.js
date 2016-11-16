import {
  isArray,
  isPlainObject,
  isString
}
from 'lodash';
import getAll from '../utils/getAll';
import getMany from '../utils/getMany';
import getOne from '../utils/getOne';

function get(...args) {
  if (args.length === 0) {
    return getAll(this);
  }
  else if (args.length >= 1) {
    if (isString(args[0])) {
      return getOne(this, ...args);
    }
    else if (isArray(args[0])) {
      return getMany(this, ...args);
    }
    else if (isPlainObject(args[0])) {
      return getAll(this, ...args);
    }
  }
};

export default get;