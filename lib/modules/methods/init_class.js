var classMethods = {};

classMethods.getMethods = function() {
  return this.schema.methods;
};

Astro.eventManager.on('initClass', function onInitClassMethods() {
  var Class = this;

  // Add fields methods to the class.
  _.extend(Class, classMethods);

  _.each(Class.getMethods(), function(method, methodName) {
    Class.prototype[methodName] = method;
  });
});
