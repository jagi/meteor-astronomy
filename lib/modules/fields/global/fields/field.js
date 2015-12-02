Astro.Field = class Field {
  constructor(definition) {
    definition = definition || {};

    // The field name has to be a string.
    if (!_.isString(definition.name)) {
      throw new TypeError(
        'The field name has to be a string'
      );
    }
    // Check if the field name contains allowed characters.
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(definition.name)) {
      throw new Error(
        'The "' + fieldName + '" field name contains not allowed characters'
      );
    }
    // Check if a field type exists
    if (definition.type && !Astro.Type.get(definition.type)) {
      throw new Error(
        'The "' + definition.type + '" type for the "' + definition.name +
        '" field does not exist'
      );
    }
    // Non plain values have to be returned from the function because objects
    // are passed by reference in JavaScript.
    if (
      _.isObject(definition.default) &&
      !_.isFunction(definition.default)
    ) {
      throw new Error(
        'A non plain default value for the "' + definition.name + '" field ' +
        'has to be defined and returned from the function'
      );
    }

    this.type = definition.type === undefined || definition.type === null ?
      null : Astro.Type.get(definition.type);
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
};
