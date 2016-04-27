import _ from 'lodash';
import Validator from '../../validator.js';

Validator.create({
  name: 'includes',
  isValid({ value, param }) {
    if (!_.isArray(value) && !_.isArray(object)) {
      throw new TypeError(
        `The "includes" validator can only work with arrays and objects`
      );
    }
    return _.includes(value, param);
  },
  resolveError({ name, param }) {
    return `The "${name}" field does not contain the "${param}" value`;
  }
});