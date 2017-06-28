import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import rawAll from '../utils/rawAll';
import rawMany from '../utils/rawMany';
import rawOne from '../utils/rawOne';

function raw(...args) {
  if (args.length === 0) {
    return rawAll(this);
  }
  else if (args.length >= 1) {
    if (typeof args[0] === 'string') {
      return rawOne(this, ...args);
    }
    else if (_isArray(args[0])) {
      return rawMany(this, ...args);
    }
    else if (_isPlainObject(args[0])) {
      return rawAll(this, ...args);
    }
  }
};

export default raw;