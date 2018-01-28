import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import Validator from '../../validator.js';

Validator.create({
  name: 'number',
  isValid({ value }) {
    return !_isNaN(value) && _isNumber(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a number`;
  }
});
