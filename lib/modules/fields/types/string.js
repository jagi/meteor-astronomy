import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'String',
  class: String,
  cast(value) {
    return String(value);
  },
  validate(args) {
    Validators.string(args);
  }
});