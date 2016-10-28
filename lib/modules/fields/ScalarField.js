import {
  isNil
}
from 'lodash';
import Field from './Field';

class ScalarField extends Field {
  constructor(definition = {}) {
    super(definition);

    this.type = definition.type;
  }

  cast(value) {
    if (!isNil(value)) {
      return this.type.cast(value);
    }
    return value;
  }

  validate(args) {
    super.validate(args);
    var {
      value
    } = args;

    if (!isNil(value)) {
      return this.type.validate(args);
    }
  }
};

export default ScalarField;