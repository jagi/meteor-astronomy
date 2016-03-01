import Validator from '../../validator.js';

Validator.create({
  name: 'array',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isArray(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be an array`;
  }
});