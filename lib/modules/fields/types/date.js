import _ from 'lodash';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Date',
  class: Date,
  cast(value) {
    return new Date(value);
  },
  validate(args) {
    Validators.date(args);
  }
});