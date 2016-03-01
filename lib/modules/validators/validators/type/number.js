import Validator from '../../validator.js';

Validator.create({
  name: 'number',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isNumber(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be a number`;
  }
});