import Validators from '../validators/validators.js';

class Field {
  constructor(definition = {}) {
    _.defaults(definition, {
      optional: false,
      immutable: false,
      transient: false
    });

    this.name = definition.name;
    this.type = definition.type;
    this.default = definition.default
    this.optional = definition.optional;
    this.immutable = definition.immutable;
    this.transient = definition.transient;
    this.resolve = definition.resolve;
  }

  getDefault() {
    if (_.isFunction(this.default)) {
      return this.default();
    }
    return this.default;
  }

  validate(args) {
    // If a field is not optional (required) then it has to have value.
    if (!this.optional) {
      Validators.required(args);
    }
  }

  resolveValue(plainDoc) {
    let value;
    if (this.resolve) {
      value = this.resolve(plainDoc);
    }
    else {
      value = plainDoc[this.name];
    }
    if (value === undefined) {
      value = this.getDefault();
    }
    return value;
  }
};

export default Field;