var validateOne = function(validatorsData, fieldName) {
  // We have to distinguish here two terms. The `validator` is the global object
  // that provides some functionality to check whether value is valid or not.
  // On the other side `validatorsData` is the data provided in the class schema
  // for given field name.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  // Stop execution if there is no validation data provided for the given field
  // name in the class schema. We have to do this check because user can try to
  // validate single field. Normally when validating whole object this situation
  // would have never happen. When calling `addValidators` on schema, it makes
  // sure that all validation data had been provided.
  if (!validatorsData) {
    throw new Error('There is not validation data for field `' + fieldName +
      '` in `' + schema.getName() + '` class schema');
  }

  // Validators for field are stored in an array so we have to loop through all
  // validators and check validity for each one.
  _.each(validatorsData, function(validatorData) {
    // Get validator for given field.
    var validator = Validators[validatorData.type];

    // Get given field's current value.
    var value = this.get(fieldName);

    // Validate value and throw exception, if it's invalid.
    validator.validate(value, validatorData.options, validatorData.messages);
  }, this);
};

var validate = function(fieldName) {
  // Functions `schema.getValidator` and `schema.getValidators` get validation
  // data defined in the given class schema not global validator object.

  // Get schema for given object instance.
  var schema = this.constructor.schema;

  // We can validate single field or the whole object.
  if (fieldName) {
    validateOne.call(this, schema.getValidator(fieldName), fieldName);
  } else {
    _.each(schema.getValidators(), validateOne, this);
  }
};

Astronomy.Module({
  name: 'Validators',
  initSchema: function(Class, definition) {
    this._validators = {};

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }

    Class.prototype.validate = validate;
  }
});
