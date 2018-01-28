import _each from 'lodash/each';
import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';
import _isPlainObject from 'lodash/isPlainObject';
import _map from 'lodash/map';
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
    if (!_isNil(value)) {
      Validators.array(args);
      _each(value, (element, index) => {
        this.type.validate({
          doc,
          name: name + '.' + index,
          value: element
        });
      });
    }
  }

  cast(value, options) {
    if (options.element) {
      return this.type.cast(value, options);
    }
    if (value === '' && this.optional) {
      return null;
    }
    else if (_isArray(value)) {
      return _map(value, (element) => {
        // Class type.
        if (this.isClass) {
          // We only cast if a value is a plain object.
          if (_isPlainObject(element)) {
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
    return _map(resolvedValues, (nestedRawDoc) => {
      return resolveValues({
        Class: this.type.class,
        rawDoc: nestedRawDoc
      });
    });
  }
};

export default ListField;
