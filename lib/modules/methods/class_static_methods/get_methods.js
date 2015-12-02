let classStaticMethods = Astro.Module.modules.methods.classStaticMethods;

classStaticMethods.getMethods = function() {
  return this.schema.methods;
};