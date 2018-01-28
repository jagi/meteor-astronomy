import _has from 'lodash/has';
import Validator from '../../validator.js';

Validator.create({
  name: 'minLength',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "minLength" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    if (!_has(value, 'length')) {
      return false;
    }
    return value.length >= param;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be at least ${param}`;
  }
});