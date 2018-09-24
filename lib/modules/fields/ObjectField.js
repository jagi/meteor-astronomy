import _isPlainObject from 'lodash/isPlainObject';
import Field from './Field';
import castToClass from './utils/castToClass';
import resolveValues from './utils/resolveValues';

class ObjectField extends Field {
  validate(args) {
    super.validate(args);
    this.type.validate(args);
  }

  cast(value, options) {
    if (value === '' && this.optional) {
      return null;
    }
    // We only cast if a value is a plain object.
    else if (_isPlainObject(value)) {
      // Cast value to an instance of the class.
      return castToClass({
        Class: this.type.class,
        rawDoc: value,
        options
      });
    }
    return value;
  }

  resolveValue(rawDoc) {
    return resolveValues({
      Class: this.type.class,
      rawDoc: super.resolveValue(rawDoc)
    });
  }
};

export default ObjectField;