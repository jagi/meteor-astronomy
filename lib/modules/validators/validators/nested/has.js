import _ from 'lodash';
import Validator from '../../validator.js';

Validator.create({
  name: 'has',
  isValid({ value, param }) {
    if (!_.isObject(value)) {
      throw new TypeError(
        `The "has" validator can only work with objects`
      );
    }
    return _.has(value, param);
  },
  resolveError({ name, param }) {
    return `The "${name}" field does not have the "${param}" property`;
  }
});