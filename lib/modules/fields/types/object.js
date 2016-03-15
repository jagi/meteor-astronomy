import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Object',
  class: Object,
  validate(args) {
    Validators.object(args);
  }
});