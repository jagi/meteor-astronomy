import Validator from '../../validator.js';

Validator.create({
  name: 'equal',
  isValid({ value, param }) {
    if (value instanceof Date && param instanceof Date) {
      return value.getTime() === param.getTime();
    }
    return value === param;
  },
  resolveError({ name, param }) {
    return `"${name}" should be equal ${param}`;
  }
});
