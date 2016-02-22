import Validator from '../../validator.js';

Validator.create({
  name: 'object',
  isValid({ value }) {
    return _.isObject(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an object`;
  }
});