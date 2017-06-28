import _isObject from 'lodash/isObject';
import Validator from '../../validator.js';

Validator.create({
  name: 'object',
  isValid({ value }) {
    return _isObject(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an object`;
  }
});