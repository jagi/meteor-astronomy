import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Boolean',
  class: Boolean,
  validate(args) {
    Validators.boolean(args);
  }
});