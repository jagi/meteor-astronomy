import Validator from '../../validator.js';

Validator.create({
  name: 'date',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return _.isDate(value);
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be a date`;
  }
});