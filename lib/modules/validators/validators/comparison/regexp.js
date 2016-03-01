import Validator from '../../validator.js';

Validator.create({
  name: 'regexp',
	parseParam(param) {
    if (!Match.test(param, RegExp)) {
      throw new TypeError(
        `Parameter for the "regexp" validator has to be a regular expression`
      );
    }
  },
  isValid({ value, param }) {
    if (value !== undefined && value !== null) {
      return param.test(value);
    }
    return true;
  },
  resolveError({ name, param }) {
    return `"${name}" does not match the "${param.toString()}" regular expression`;
  }
});