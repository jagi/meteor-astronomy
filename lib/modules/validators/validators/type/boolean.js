import Validator from '../../validator.js';

Validator.create({
  name: 'boolean',
  isValid({ value }) {
    return typeof value === 'boolean';
  },
  resolveError({ name }) {
    return `"${name}" has to be a boolean`;
  }
});