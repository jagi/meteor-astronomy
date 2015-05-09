methodsOnInitSchema = function(Class, definition) {
  this._methods = {};

  if (_.has(definition, 'methods')) {
    this.addMethods(definition.methods);
  }
};
