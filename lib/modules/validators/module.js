var validate = function(context) {
  var schema = this.constructor.schema;

  context = context || 'default';

  var validator = schema.getValidator(context);
  if (validator === undefined) {
    throw new Error('There is no "' + context + '" validate context');
  }

  validator.call(this);
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
