import {
  isDate,
  isNaN,
  isString
}
from 'lodash';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Date',
  class: Date,
  cast(value) {
    if (isDate(value)) {
      return value;
    }
    else if (isString(value) && /^[0-9]+$/.test(value)) {
      return new Date(parseInt(value, 10));
    }
    else {
      const time = Date.parse(value);
      if (isNaN(time)) {
        return value;
      }
      else {
        return new Date(time);
      }
    }
  },
  validate(args) {
    Validators.date(args);
  }
});