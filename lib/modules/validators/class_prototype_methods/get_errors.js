let methods = Astro.Module.modules.validators.classPrototypeMethods;

methods.getErrors = function() {
  let doc = this;

  return doc._errors.all();
};