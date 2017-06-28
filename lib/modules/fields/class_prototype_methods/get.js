import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import getAll from '../utils/getAll';
import getMany from '../utils/getMany';
import getOne from '../utils/getOne';

function get(...args) {
  if (args.length === 0) {
    return getAll(this);
  }
  else if (args.length >= 1) {
    if (typeof args[0] === 'string') {
      return getOne(this, ...args);
    }
    else if (_isArray(args[0])) {
      return getMany(this, ...args);
    }
    else if (_isPlainObject(args[0])) {
      return getAll(this, ...args);
    }
  }
};

export default get;