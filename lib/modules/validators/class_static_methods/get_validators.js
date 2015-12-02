let methods = Astro.Module.modules.validators.classStaticMethods;

methods.getValidators = function() {
  return this.schema.validators;
};