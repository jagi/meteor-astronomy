import Validator from '../../validator.js';

Validator.create({
  name: 'number',
  isValid({ value }) {
    return _.isNumber(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a number`;
  }
});