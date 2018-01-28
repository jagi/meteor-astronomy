import Validator from '../../validator.js';

Validator.create({
  name: 'string',
  isValid({ value }) {
    return typeof value === 'string';
  },
  resolveError({ name }) {
    return `"${name}" has to be a string`;
  }
});