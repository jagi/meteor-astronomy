import _ from 'lodash';
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
          name: name + '.' + index,
          value: element
        });
      });
    }
  }
};

export default ListField;
