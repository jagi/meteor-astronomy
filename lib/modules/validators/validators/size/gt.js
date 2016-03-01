import Validator from '../../validator.js';

Validator.create({
  name: 'gt',
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return value > param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be greater than ${param}`;
  }
});