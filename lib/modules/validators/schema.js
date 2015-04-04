var prototype = Astronomy.Schema.prototype;

prototype.getValidator = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._validators[fieldName];
};

prototype.getValidators = function() {
  return this._validators;
};

prototype.addValidator = function(fieldName, definition) {
  if (!_.isObject(definition)) {
    return;
  }

  this._validators[fieldName] = definition;
};

prototype.addValidators = function(validators) {
  if (!_.isObject(validators)) {
    return;
  }

  _.each(validators, function(definition, fieldName) {
    this.addValidator(fieldName, definition);
  }, this);
};
