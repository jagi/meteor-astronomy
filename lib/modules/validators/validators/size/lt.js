import Validator from '../../validator.js';

Validator.create({
  name: 'lt',
  isValid({ value, param }) {
    return value < param;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be less than ${param}`;
  }
});