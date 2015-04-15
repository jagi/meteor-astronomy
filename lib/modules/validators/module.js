var validateOne = function(validatorData) {
  // We have to distinguish here two terms. The `validator` is the global object
  // that provides some functionality to check whether value is valid or not.
  // On the other side `validatorData` is the data provided in the class schema
  // for given field name.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  // Get validator for given type.
  var validator = Validators[validatorData.type];

  // Validate value and throw exception, if it's invalid. Call validate function
  // in the context of the object being validated.
  validator.validate.call(this, validatorData.options, validatorData.messages);
};

var validate = function() {
  // Functions `schema.getValidator` and `schema.getValidators` get validation
  // data defined in the given class schema not global validator object.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  // Get schema validators and run validate function for each one.
  _.each(schema.getValidators(), validateOne, this);
};

Astronomy.Module({
  name: 'Validators',
  initSchema: function(Class, definition) {
    this._validators = [];

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }

    Class.prototype.validate = validate;
  }
});
