import {
  isArray,
  map,
  isPlainObject,
  isNil,
  each,
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

  cast(value, options) {
    if (!isArray(value)) {
      return value;
    }
    return map(value, (element) => {
      // Class type.
      if (this.isClass) {
        // We only cast if value is a plain object.
        if (!isPlainObject(element)) {
          return element;
        }
        // Get class from type property.
        const Class = this.type.class;
        // Cast value to an instance of the class.
        return castToClass({
          Class,
          rawDoc: element,
          options
        });
      }
      // Scalar type.
      else {
        // The "cast" option is only passed to the ObjectFields and ListFields.
        // Here we have to check if it's set, so we don't cast if user don't
        // want to.
        if (options.cast) {
          return this.type.cast(element);
        }
        return element;
      }
    });
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
