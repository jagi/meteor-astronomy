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
    var className = schemaDefinition.className;

    if (_.has(schemaDefinition, 'methods')) {
      var methods = {};

      _.each(schemaDefinition.methods, function(method, methodName) {
        if (_.isFunction(method)) {
          methods[methodName] = method;
          // Check validity of the method definition.
          checkMethod(methods[methodName], methodName, className);
        }
      });

      schemaDefinition.methods = methods;
    }
  }
);
