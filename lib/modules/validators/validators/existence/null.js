import Validator from '../../validator.js';

Validator.create({
  name: 'null',
  isValid({ value }) {
    return value === null;
  },
  resolveError({ name }) {
    return `"${name}" should be null`;
  }
});