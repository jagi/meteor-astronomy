import Validator from '../../validator.js';

Validator.create({
  name: 'length',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "length" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    return value.length === param;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be ${param}`;
  }
});