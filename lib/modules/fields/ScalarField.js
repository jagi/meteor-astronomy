import isNil from 'lodash/isNil';
import Field from './Field';

class ScalarField extends Field {
  cast(value) {
    return this.type.cast.call(this, value);
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