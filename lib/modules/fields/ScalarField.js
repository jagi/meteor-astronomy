import {
  isNil
}
from 'lodash';
import Field from './Field';

class ScalarField extends Field {
  cast(value) {
    return this.type.cast(value);
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