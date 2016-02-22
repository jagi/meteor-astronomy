import Validator from '../../validator.js';

Validator.create({
  name: 'array',
  isValid({ value }) {
    return _.isArray(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an array`;
  }
});