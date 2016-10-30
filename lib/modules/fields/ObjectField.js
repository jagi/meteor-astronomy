import {
  isPlainObject
}
from 'lodash';
import Field from './Field';
import castToClass from './utils/castToClass';
import resolveValues from './utils/resolveValues';

class ObjectField extends Field {
  validate(args) {
    super.validate(args);
    this.type.validate(args);
  }

  castValue(value, options) {
    if (this.cast) {
      return this.cast(value);
    }
    // We only cast if value is a plain object.
    if (!isPlainObject(value)) {
      return value;
    }
    // Get class from type property.
    const Class = this.type.class;
    // Cast value to an instance of the class.
    return castToClass({
      Class,
      rawDoc: value,
      options
    });
  }

  resolveValue(rawDoc) {
    return resolveValues({
      Class: this.type.class,
      rawDoc: super.resolveValue(rawDoc)
    });
  }
};

export default ObjectField;