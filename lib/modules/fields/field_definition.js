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
  this.default = definition.default;
};

Field.prototype.getDefault = function() {
  var self = this;

  if (_.isFunction(self.default)) {
    return self.default();
  } else if (!_.isUndefined(self.default)) {
    return self.default;
  }

  return null;
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
