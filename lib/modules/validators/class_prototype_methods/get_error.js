let methods = Astro.Module.modules.validators.classPrototypeMethods;

methods.getError = function(name) {
  let doc = this;
  return doc._errors.get(name).message;
};