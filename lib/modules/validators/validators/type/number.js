import _ from 'lodash';
import Validator from '../../validator.js';

Validator.create({
  name: 'number',
  isValid({ value }) {
    return !_.isNaN(value) && _.isNumber(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a number`;
  }
});
