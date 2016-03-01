import Validator from '../../validator.js';

Validator.create({
  name: 'object',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isObject(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be an object`;
  }
});