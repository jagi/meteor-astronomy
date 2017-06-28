import _isArray from 'lodash/isArray';
import Validator from '../../validator.js';

Validator.create({
  name: 'array',
  isValid({ value }) {
    return _isArray(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an array`;
  }
});