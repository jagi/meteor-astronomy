Astro.Module.modules.methods.onApplyDefinition = function(
  Class, parsedDefinition, className
) {
  var schema = Class.schema;

  // Add methods to the class.
  _.each(parsedDefinition.methods, function(method, methodName) {
    schema.methods[methodName] = method;
    Class.prototype[methodName] = method;
  });
};
