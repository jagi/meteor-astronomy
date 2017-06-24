import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import Validator from '../../validator.js';

Validator.create({
  name: 'number',
  isValid({ value }) {
    return !isNaN(value) && isNumber(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a number`;
  }
});
