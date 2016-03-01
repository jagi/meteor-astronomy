import Validator from '../../validator.js';

Validator.create({
  name: 'boolean',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isBoolean(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be a boolean`;
  }
});