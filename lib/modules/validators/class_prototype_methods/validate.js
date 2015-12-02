let methods = Astro.Module.modules.validators.classPrototypeMethods;

methods.validate = function() {
  let doc = this;

  // Trigger the "validation" event handlers.
  doc.dispatchEvent(new Astro.Event('validation', {
    propagates: true
  }));

  let errors = doc._errors.all();
  _.each(errors, function(error, fieldName) {
    doc.dispatchEvent(new Astro.Event('validationError', {
      error: error
    }));
  });

  return _.size(errors) === 0;
};