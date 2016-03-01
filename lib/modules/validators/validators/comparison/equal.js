import Validator from '../../validator.js';

Validator.create({
  name: 'equal',
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return value === param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" should be equal ${param}`;
  }
});