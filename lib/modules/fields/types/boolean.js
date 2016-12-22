import {
  isBoolean,
  isObject,
  isString
}
from 'lodash';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Boolean',
  class: Boolean,
  cast(value) {
    if (isBoolean(value) && isObject(value)) {
      return value;
    }
    else if (isString(value)) {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
        else {
          return false;
        }
      }
      else if (value.toLowerCase() === 'false' || value === '0') {
        return false;
      }
    }
    return Boolean(value);
  },
  validate(args) {
    Validators.boolean(args);
  }
});