import isDate from 'lodash/isDate';
import Validator from '../../validator.js';

Validator.create({
  name: 'date',
  isValid({ value }) {
    return isDate(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a date`;
  }
});