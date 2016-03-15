import Field from './field.js';

class ScalarField extends Field {
  constructor(definition = {}) {
    super(definition);

    this.type = definition.type;
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