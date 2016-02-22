import Validator from '../../validator.js';

Validator.create({
  name: 'gt',
  isValid({ value, param }) {
    return value > param;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be greater than ${param}`;
  }
});