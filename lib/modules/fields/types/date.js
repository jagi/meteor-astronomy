import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Date',
  class: Date,
  cast(value) {
    if (isNumber(value)) {
      return new Date(value);
    }
    else if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
      }
      else if (/^[0-9]+$/.test(value)) {
        return new Date(parseInt(value, 10));
      }
      else {
        const time = Date.parse(value);
        if (!isNaN(time)) {
          return new Date(time);
        }
      }
    }
    return value;
  },
  validate(args) {
    Validators.date(args);
  }
});