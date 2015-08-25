var Field = Astro.Field = function Field(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  // Check whether the given field type exists.
  if (definition.type && !_.has(Astro.types, definition.type)) {
    Astro.errors.throw('fields.not_exist', definition.type);
  }

  this.name = _.isUndefined(definition.name) ? null : definition.name;
  this.type = definition.type || null;
  this.default = _.isUndefined(definition.default) ? null : definition.default;
  this.required = _.isUndefined(definition.required) ?
    false : definition.required;
};

Field.prototype.getDefault = function() {
  var self = this;

  if (_.isFunction(self.default)) {
    return self.cast(self.default());
  } else if (_.isNull(self.default)) {
    return null;
  }

  return self.cast(self.default);
};

Field.prototype.cast = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (self.type) {
    var type = Astro.types[self.type];
    value = type.cast(value);
  }

  return value;
};

Field.prototype.plain = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (self.type) {
    var type = Astro.types[self.type];
    value = type.plain(value);
  } else if (value) {
    value = value.valueOf();
  }

  return value;
};
