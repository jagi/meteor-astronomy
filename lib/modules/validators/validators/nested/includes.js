import _includes from 'lodash/includes';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import Validator from '../../validator.js';

Validator.create({
  name: 'includes',
  isValid({ value, param }) {
    if (!_isArray(value) && !_isObject(value)) {
      throw new TypeError(
        `The "includes" validator can only work with arrays and objects`
      );
    }
    return _includes(value, param);
  },
  resolveError({ name, param }) {
    return `The "${name}" field does not contain the "${param}" value`;
  }
});