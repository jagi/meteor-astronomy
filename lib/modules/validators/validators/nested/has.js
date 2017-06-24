import isObject from 'lodash/isObject';
import has from 'lodash/has';
import Validator from '../../validator.js';

Validator.create({
  name: 'has',
  isValid({ value, param }) {
    if (!isObject(value)) {
      throw new TypeError(
        `The "has" validator can only work with objects`
      );
    }
    return has(value, param);
  },
  resolveError({ name, param }) {
    return `The "${name}" field does not have the "${param}" property`;
  }
});