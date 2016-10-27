import {
  isBoolean,
  isString
}
from 'lodash';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Boolean',
  class: Boolean,
  cast(value) {
    if (isBoolean(value)) {
      return value;
    }
    else if (isString(value) && value.toLowerCase() === 'false' || value === '0') {
      return false;
    }
    return Boolean(value);
  },
  validate(args) {
    Validators.boolean(args);
  }
});