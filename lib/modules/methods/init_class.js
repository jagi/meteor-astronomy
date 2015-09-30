var classMethods = {};

classMethods.getMethods = function() {
  var methods = {};

  _.each(this.schema.definitions, function(schemaDefinition) {
    _.extend(methods, schemaDefinition.methods);
  });

  return methods;
};

Astro.eventManager.on(
  'initClass', function onInitClassMethods(schemaDefinition) {
    var Class = this;

    // Extend class with class methods.
    _.extend(Class, classMethods);
  }
);
