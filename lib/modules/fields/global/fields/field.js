Astro.Field = class Field {
  constructor(definition) {
    definition = definition || {};

    this.name = definition.name;
    this.default = definition.default === undefined ?
      null : definition.default;
    this.optional = definition.optional === undefined ?
      false : definition.optional;
    this.immutable = definition.immutable === undefined ?
      false : definition.immutable;
    this.transient = definition.transient === undefined ?
      false : definition.transient;
  }

  getDefault() {
    if (_.isFunction(this.default)) {
      return this.default();
    } else if (_.isNull(this.default)) {
      return null;
    }
    return this.default;
  }

  validate(doc, fieldName) {
    // If a field is not optional (required) then it has to have value.
    if (!this.optional) {
      Validators.required(doc, fieldName);
    }
  }
};
