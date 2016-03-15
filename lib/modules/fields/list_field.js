import Field from './field.js';
import AstroClass from '../../core/class.js';
import Validators from '../validators/validators.js';

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

    if (!_.isNil(value)) {
      Validators.array(args);

      _.each(value, (element, index) => {
        this.type.validate({
          doc,
          name,
          value: element
        });
      });
    }
  }

  resolveValue(plainDoc) {
    let value = super.resolveValue(plainDoc);

    // Do not cast if value is empty.
    if (_.isNil(value) || !this.isClass) {
      return value;
    }
    // Cast values.
    let NestedClass = this.type.class;
    _.each(value, function(element, index) {
      if (!(element instanceof NestedClass) && _.isPlainObject(element)) {
        value[index] = new NestedClass(element);
      }
    });

    return value;
  }
};

export default ListField;