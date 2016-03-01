import Validator from '../../validator.js';

Validator.create({
  name: 'notEqual',
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return value !== param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" should not to be equal ${param}`;
  }
});