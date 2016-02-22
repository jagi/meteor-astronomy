import Validator from '../../validator.js';

Validator.create({
  name: 'gte',
  isValid({ value, param }) {
    return value >= param;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be greater than or equal ${param}`;
  }
});