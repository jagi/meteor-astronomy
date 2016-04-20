import Validator from '../../validator.js';

// Email regular expression.
let re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

Validator.create({
  name: 'email',
  isValid({ value }) {
    return re.test(value);
  },
  resolveError({ name, param }) {
    return `"${name}" should be a valid email address`;
  }
});