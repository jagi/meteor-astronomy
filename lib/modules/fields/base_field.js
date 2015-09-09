var BaseField = Astro.BaseField = function BaseField(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  this.name = _.isUndefined(definition.name) ?
    null : definition.name;
  this.default = _.isUndefined(definition.default) ?
    null : definition.default;
  this.optional = _.isUndefined(definition.optional) ?
    false : definition.optional;
  this.immutable = _.isUndefined(definition.immutable) ?
    false : definition.immutable;
  this.transient = _.isUndefined(definition.transient) ?
    false : definition.transient;
};

BaseField.prototype._needsCast =
BaseField.prototype._needsPlain = function(value) {
  return !_.isUndefined(value) && !_.isNull(value);
};

BaseField.prototype.getDefault = function() {
  if (_.isFunction(this.default)) {
    return this.cast(this.default());
  } else if (_.isNull(this.default)) {
    return null;
  }

  return this.cast(this.default);
};

BaseField.prototype._cast = function(value) {
  return value;
};

BaseField.prototype._plain = function(value) {
  return value.valueOf();
};

BaseField.prototype.cast = function(value) {
  if (this._needsCast(value)) {
    return this._cast(value);
  }

  return value;
};

BaseField.prototype.plain = function(value) {
  if (this._needsPlain(value)) {
    return this._plain(value);
  }

  return value;
};
