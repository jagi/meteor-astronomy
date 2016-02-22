import Validator from '../../validator.js';

Validator.create({
  name: 'string',
  isValid({ value }) {
    return _.isString(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a string`;
  }
});