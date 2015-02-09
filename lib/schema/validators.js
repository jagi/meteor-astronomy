Schema.prototype.getValidator = function (context) {
  if (!_.isString(context)) return;

  return this._validators[context];
};

Schema.prototype.getValidators = function () {
  return this._validators;
};

Schema.prototype.addValidator = function (context, validator) {
  if (!_.isString(context)) return;
  if (!_.isFunction(validator)) return;

  this._validators[context] = validator;
};

Schema.prototype.addValidators = function (validators) {
  if (!_.isObject(validators)) return;

  for (var context in validators) {
    if (validators.hasOwnProperty(context)) {
      this.addValidator(context, validators[context]);
    }
  }
};
