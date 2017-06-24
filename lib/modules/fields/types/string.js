import isObject from 'lodash/isObject';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'String',
  class: String,
  cast(value) {
    if (typeof value === 'string' || isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args);
  }
});