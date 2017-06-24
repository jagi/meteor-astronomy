import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import Validator from '../../validator.js';

Validator.create({
  name: 'includes',
  isValid({ value, param }) {
    if (!isArray(value) && !isObject(value)) {
      throw new TypeError(
        `The "includes" validator can only work with arrays and objects`
      );
    }
    return includes(value, param);
  },
  resolveError({ name, param }) {
    return `The "${name}" field does not contain the "${param}" value`;
  }
});