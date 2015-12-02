let classStaticMethods = Astro.Module.modules.methods.classStaticMethods;

classStaticMethods.hasMethod = function(methodName) {
  return _.has(this.schema.methods, methodName);
};