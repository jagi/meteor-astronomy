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
  this.default = _.isUndefined(definition.default) ? null : definition.default;
};

Field.prototype.getDefault = function() {
  if (_.isFunction(this.default)) {
    return this.default();
  } else {
    return this.default;
  }
};

Field.prototype.cast = function(value) {
  var type = Astro.types[this.type] || Astro.types.null;
  return type.cast(value);
};

Field.prototype.plain = function() {
  var type = Astro.types[this.type] || Astro.types.null;
  return type.plain(value);
};
