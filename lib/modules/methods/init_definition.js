var checkMethod = function(method, methodName, className) {
  // The method name has to be a string.
  if (!Match.test(methodName, String)) {
    throw new Error(
      'The method name in the "' + className + '" class has to be a string'
    );
  }
  // The method has to be a function.
  if (!Match.test(method, Function)) {
    throw new Error(
      'The "' + methodName + '" method in the "' + className +
      '" class has to be a function'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionMethods(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;
    var methodsDefinitions = {};

    if (_.has(schemaDefinition, 'methods')) {
      _.each(schemaDefinition.methods, function(method, methodName) {
        if (_.isFunction(method)) {
          methodsDefinitions[methodName] = method;
          // Check validity of the method definition.
          checkMethod(method, methodName, Class.getName());
        }
      });
    }

    if (_.size(methodsDefinitions) > 0) {
      _.each(methodsDefinitions, function(method, methodName) {
        Class.prototype[methodName] = method;
      });

      // Add methods to the schema.
      _.extend(schema.methods, schemaDefinition.methods);
    }
  }
);
