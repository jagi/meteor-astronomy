import Validator from '../../validator.js';

Validator.create({
  name: 'string',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isString(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be a string`;
  }
});