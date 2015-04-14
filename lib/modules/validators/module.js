var validateOne = function(validator, fieldName) {
  // Stop execution if there is no validator for given field name.
  if (!validator) {
    return;
  }

  // Get current field value.
  var value = this.get(fieldName);


  console.log(value);
};

var validate = function(fieldName) {
  var schema = this.constructor.schema;

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
