import Validator from '../../validator.js';

Validator.create({
  name: 'lt',
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return value < param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be less than ${param}`;
  }
});