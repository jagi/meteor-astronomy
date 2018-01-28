import _isInteger from 'lodash/isInteger';
import Validator from '../../validator.js';

Validator.create({
  name: 'integer',
  isValid({ value }) {
    return _isInteger(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an integer`;
  }
});