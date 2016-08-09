import _ from 'lodash';
import Field from './Field';

class ScalarField extends Field {
  constructor(definition = {}) {
    super(definition);

    this.type = definition.type;
  }

  cast(value) {
    return this.type.cast(value);
  }

  validate(args) {
    super.validate(args);
    var {
      value
    } = args;

    if (!_.isNil(value)) {
      return this.type.validate(args);
    }
  }
};

export default ScalarField;