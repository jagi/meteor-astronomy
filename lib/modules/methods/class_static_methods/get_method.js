let classStaticMethods = Astro.Module.modules.methods.classStaticMethods;

classStaticMethods.getMethod = function(methodName) {
  return this.schema.methods[methodName];
};