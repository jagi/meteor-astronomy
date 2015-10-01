var classMethods = {};

classMethods.hasMethod = function(methodName) {
  return _.has(this.schema.methods, methodName);
};

classMethods.getMethod = function(methodName) {
  return this.schema.methods[methodName];
};

classMethods.getMethods = function() {
  return this.schema.methods;
};

Astro.eventManager.on(
  'initClass', function onInitClassMethods(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    // Extend class with class methods.
    _.extend(Class, classMethods);

    schema.methods = schema.methods || {};
  }
);
