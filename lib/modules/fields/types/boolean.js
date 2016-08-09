import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Boolean',
  class: Boolean,
  cast(value) {
    if (_.isString(value) && value.toLowerCase() === 'false' || value === '0') {
      return false;
    }
    return Boolean(value);
  },
  validate(args) {
    Validators.boolean(args);
  }
});