var BaseField = Astro.BaseField = function BaseField(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  this.name = _.isUndefined(definition.name) ? null : definition.name;
  this.default = _.isUndefined(definition.default) ? null : definition.default;
  this.required = _.isUndefined(definition.required) ?
    false : definition.required;
};

BaseField.prototype.getDefault = function() {
  var self = this;

  if (_.isFunction(self.default)) {
    return self.cast(self.default());
  } else if (_.isNull(self.default)) {
    return null;
  }

  return self.cast(self.default);
};

BaseField.prototype.cast = function(value) {
  return value;
};

BaseField.prototype.plain = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  return value.valueOf();
};
