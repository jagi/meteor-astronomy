import Validator from '../../validator.js';

Validator.create({
  name: 'equal',
  isValid({ value, param }) {
    return EJSON.equals(value, param);
  },
  resolveError({ name, param }) {
    return `"${name}" should be equal ${param}`;
  }
});
