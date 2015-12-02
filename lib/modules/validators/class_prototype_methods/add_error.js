let methods = Astro.Module.modules.validators.classPrototypeMethods;

methods.addError = function(name, error) {
  let doc = this;

  if (Match.test(error, String)) {
    error = {
      validator: custom,
      message: error
    }
  }

  doc._errors.set(name, error);
};