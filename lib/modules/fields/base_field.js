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

BaseField.prototype.getDefault = function() {
  var defaultValue;

  // Get a default value from the function if provided.
  if (_.isFunction(this.default)) {
    defaultValue = this.default();
  } else if (_.isNull(this.default)) {
    return null;
  } else {
    defaultValue = this.default;
  }

  if (_.isFunction(this._getDefault)) {
    // User defined "getDefault" method is responsible for casting a value.
    return this._getDefault(defaultValue);
  }

  return this.cast(defaultValue);
};

BaseField.prototype.needsCast = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return false;
  }

  if (_.isFunction(this._needsCast)) {
    return this._needsCast(value);
  }

  return true;
};

BaseField.prototype.cast = function(value) {
  if (this.needsCast(value)) {
    if (_.isFunction(this._cast)) {
      return this._cast(value);
    }
  }

  return value;
};

BaseField.prototype.needsPlain = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return false;
  }

  if (_.isFunction(this._needsPlain)) {
    return this._needsPlain(value);
  }

  return true;
};

BaseField.prototype.plain = function(value) {
  if (this.needsPlain(value)) {
    if (_.isFunction(this._plain)) {
      return this._plain(value);
    } else {
      return value.valueOf();
    }
  }

  return value;
};
