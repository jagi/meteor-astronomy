import _ from 'lodash';
import Validator from '../../validator.js';

Validator.create({
  name: 'maxLength',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "maxLength" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    if (!_.has(value, 'length')) {
      return false;
    }
    return value.length <= param;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be at most ${param}`;
  }
});