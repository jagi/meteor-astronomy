let methods = Astro.Module.modules.validators.classPrototypeMethods;

methods.hasError = function(name) {
  let doc = this;

  return doc._errors.has(name);
};