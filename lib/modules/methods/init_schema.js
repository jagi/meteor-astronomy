var addMethod = function(methodName, method) {
  var schema = this;

  // Add a method to the schema.
  schema.methods[methodName] = method;
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaMethods(schemaDefinition) {
    var schema = this;

    // Add the "methods" attribute to the schema.
    schema.methods = schema.methods || {};

    if (_.has(schemaDefinition, 'methods')) {
      _.each(schemaDefinition.methods, function(method, methodName) {
        addMethod.call(schema, methodName, method);
      });
    }
  }
);
