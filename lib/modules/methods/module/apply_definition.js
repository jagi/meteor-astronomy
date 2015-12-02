Astro.Module.modules.methods.onApplyDefinition = function(
  Class, definition, className
) {
  var schema = Class.schema;

  // Add methods to the class.
  _.each(definition.methods, function(method, methodName) {
    schema.methods[methodName] = method;
    Class.prototype[methodName] = method;
  });
};
