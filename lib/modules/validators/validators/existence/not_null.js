import Validator from '../../validator.js';

Validator.create({
  name: 'notNull',
  isValid({ value }) {
    return value !== null;
  },
  resolveError({ name }) {
    return `"${name}" should not be null`;
  }
});