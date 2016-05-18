import _ from 'lodash';
import Validator from '../../validator.js';

Validator.create({
  name: 'integer',
  isValid({ value }) {
    return _.isInteger(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be an integer`;
  }
});