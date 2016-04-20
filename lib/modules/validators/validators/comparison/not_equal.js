import Validator from '../../validator.js';

Validator.create({
  name: 'notEqual',
  isValid({ value, param }) {
    return value !== param;
  },
  resolveError({ name, param }) {
    return `"${name}" should not to be equal ${param}`;
  }
});