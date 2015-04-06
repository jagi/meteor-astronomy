var validate = function() {
  var schema = this.constructor.schema;
};

var validateOne = function(fieldName) {
  var schema = this.constructor.schema;
};

Astronomy.Module({
  name: 'Validators',
  initSchema: function(Class, definition) {
    this._validators = {};

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }

    Class.prototype.validate = validate;
    Class.prototype.validateOne = validateOne;
  }
});
