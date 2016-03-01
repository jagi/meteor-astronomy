import Validator from '../../validator.js';

Validator.create({
  name: 'minLength',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "minLength" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    if (value !== undefined && value !== null && _.has(value, 'length')) {
      return value.length >= param;
    }
    return true;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be at least ${param}`;
  }
});