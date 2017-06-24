import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Number',
  class: Number,
  cast(value) {
    if (typeof value === 'string') {
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
    else if (isObject(value)) {
      return value;
    }
    else if (!isNaN(value) && isNumber(value)) {
      return value; 
    }
    const number = Number(value);
    return !isNaN(number) ? number : value;
  },
  validate(args) {
    Validators.number(args);
  }
});
