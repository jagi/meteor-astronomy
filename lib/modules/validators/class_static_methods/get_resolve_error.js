let methods = Astro.Module.modules.validators.classStaticMethods;

methods.getResolveError = function() {
  let Class = this;

  return Class.schema.resolveError;
};