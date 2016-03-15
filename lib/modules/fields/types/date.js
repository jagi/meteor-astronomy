import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Date',
  class: Date,
  validate(args) {
    Validators.date(args);
  }
});