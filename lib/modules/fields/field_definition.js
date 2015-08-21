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
  this.type = definition.type || null;
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
  if (this.type) {
    var type = Astro.types[this.type];
    value = type.cast(value);
  }

  return value;
};

Field.prototype.plain = function(value) {
  if (this.type) {
    var type = Astro.types[this.type];
    value = type.plain(value);
  } else if (value) {
    value = value.valueOf();
  }

  return value;
};
