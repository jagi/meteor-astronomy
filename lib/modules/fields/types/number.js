import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Number',
  class: Number,
  validate(args) {
    Validators.number(args);
  }
});