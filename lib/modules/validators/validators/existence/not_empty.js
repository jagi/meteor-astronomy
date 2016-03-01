import Validator from '../../validator.js';

Validator.create({
  name: 'notEmpty',
  isValid({ value }) {
    return !!value;
  },
  resolveError({ name }) {
    return `"${name}" should not be empty`;
  }
});