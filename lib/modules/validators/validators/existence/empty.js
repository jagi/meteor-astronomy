import Validator from '../../validator.js';

Validator.create({
  name: 'empty',
  isValid({ value }) {
    return value === null || value === undefined;
  },
  resolveError({ name }) {
    return `"${name}" should be empty`;
  }
});