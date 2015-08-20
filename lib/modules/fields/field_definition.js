var Field = Astro.Field = function Field(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  // Check whether the given field type exists.
  if (definition.type && !_.has(Astro.types, definition.type)) {
    throw new Error(
      'The "' + definition.type + '" field type does not exist'
    );
  }

  this.name = _.isUndefined(definition.name) ? null : definition.name;
  if (_.isUndefined(definition.type) || _.isNull(definition.type)) {
    this.type = Astro.types.Null;
  } else {
    this.type = Astro.types[definition.type];
  }
  this.default = _.isUndefined(definition.default) ? null : definition.default;
};

Field.prototype.getDefault = function() {
  if (_.isFunction(this.default)) {
    return this.default();
  } else {
    return this.default;
  }
};
