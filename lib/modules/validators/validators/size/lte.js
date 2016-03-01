import Validator from '../../validator.js';

Validator.create({
  name: 'lte',
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return value <= param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" has to be less than or equal ${param}`;
  }
});