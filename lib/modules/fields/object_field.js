import Field from './field.js';
import { Class as AstroClass } from '../../core/class.js';
import Validators from '../validators/validators.js';

class ObjectField extends Field {
  validate(args) {
    super.validate(args);

    this.type.validate(args);
  }

  resolveValue(plainDoc) {
    let value = super.resolveValue(plainDoc);

    // Do not cast if value is empty.
    if (_.isNil(value)) {
      return value;
    }
    // Cast value.
    let NestedClass = this.type.class;
    if (!(value instanceof NestedClass) && _.isPlainObject(value)) {
      value = new NestedClass(value);
    }

    return value;
  }
};

export default ObjectField;