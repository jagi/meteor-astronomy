import _isObject from 'lodash/isObject';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'String',
  class: String,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args);
  }
});