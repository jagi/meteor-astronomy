import isArray from 'lodash/isArray';
import Validator from '../../validator.js';

Validator.create({
  name: 'array',
  isValid({ value }) {
    return isArray(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an array`;
  }
});