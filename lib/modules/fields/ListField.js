import {
  each,
  isArray,
  isFunction,
  isNil,
  isPlainObject,
  map
}
from 'lodash';
import Field from './Field';
import AstroClass from '../../core/class';
import Validators from '../validators/validators';
import castToClass from './utils/castToClass';
import resolveValues from './utils/resolveValues';

class ListField extends Field {
  constructor(definition = {}) {
    super(definition);
    this.isClass = AstroClass.isParentOf(this.type.class);
  }

  validate(args) {
    super.validate(args);
    var {
      doc,
      name,
      value
    } = args;
    // If a value is not empty.
    if (!isNil(value)) {
      Validators.array(args);
      each(value, (element, index) => {
        this.type.validate({
          doc,
          name: name + '.' + index,
          value: element
        });
      });
    }
  }

  cast(value, options) {
    if (value === '' && this.optional) {
      return null;
    }
    else if (isArray(value)) {
      return map(value, (element) => {
        // Class type.
        if (this.isClass) {
          // We only cast if a value is a plain object.
          if (isPlainObject(element)) {
            // Cast value to an instance of the class.
            return castToClass({
              Class: this.type.class,
              rawDoc: element,
              options
            });
          }
          return element;
        }
        // Scalar type.
        else {
          // The "cast" option is only passed to the ObjectFields and ListFields.
          // Here we have to check if it's set, so we don't cast if user don't
          // want to.
          if (options.cast) {
            return this.type.cast.call(this, element);
          }
          return element;
        }
      });
    }
    return value;
  }

  resolveValue(rawDoc) {
    const resolvedValues = super.resolveValue(rawDoc);
    if (!this.isClass) {
      return resolvedValues;
    }
    return map(resolvedValues, (nestedRawDoc) => {
      return resolveValues({
        Class: this.type.class,
        rawDoc: nestedRawDoc
      });
    });
  }
};

export default ListField;
