var BaseField = Astro.BaseField = function BaseField(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  this.name = _.isUndefined(definition.name) ?
    null : definition.name;
  this.default = _.isUndefined(definition.default) ?
    null : definition.default;
  this.required = _.isUndefined(definition.required) ?
    false : definition.required;
  this.transient = _.isUndefined(definition.transient) ?
    false : definition.transient;
};

BaseField.prototype.needsCast =
BaseField.prototype.needsPlain = function(value) {
  return !_.isUndefined(value) && !_.isNull(value);
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
  return value.valueOf();
};
