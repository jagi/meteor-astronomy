import _ from 'lodash';
import Field from './Field';
import castToClass from './utils/castToClass';
import AstroClass from '../../core/class.js';
import Validators from '../validators/validators.js';

class ListField extends Field {
  constructor(definition = {}) {
    super(definition);

    this.isClass = AstroClass.isParentOf(this.type.class);
  }

  cast(value, options) {
    if (!_.isArray(value)) {
      return value;
    }

    return _.map(value, (element) => {
      // Class type.
      if (this.isClass) {
        // We only cast if value is a plain object.
        if (!_.isPlainObject(element)) {
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
        return this.type.cast(element);
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

    if (!_.isNil(value)) {
      Validators.array(args);
      _.each(value, (element, index) => {
        this.type.validate({
          doc,
          name: name + '.' + index,
          value: element
        });
      });
    }
  }
};

export default ListField;
