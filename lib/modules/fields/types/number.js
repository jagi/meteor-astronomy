import {
  isNumber,
  isObject,
  isString
}
from 'lodash';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Number',
  class: Number,
  cast(value) {
    if (isString(value)) {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
        else {
          return 0;
        }
      }
    }
    else if (isNumber(value) || isObject(value)) {
      return value;
    }
    return Number(value);
  },
  validate(args) {
    Validators.number(args);
  }
});