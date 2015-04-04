Astronomy.Module({
  name: 'Validators',
  initSchema: function(Class, definition) {
    this._validators = {};

    if (_.has(definition, 'validators')) {
      this.addValidators(definition.validators);
    }
  }
});
