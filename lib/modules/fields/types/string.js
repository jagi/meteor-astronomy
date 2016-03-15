import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'String',
  class: String,
  validate(args) {
    Validators.string(args);
  }
});