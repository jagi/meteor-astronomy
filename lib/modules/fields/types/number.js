import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Number',
  class: Number,
  cast(value) {
    return Number(value);
  },
  validate(args) {
    Validators.number(args);
  }
});