Validators.and = function(doc, name, param) {
  let value = doc.get(name);

  var fieldValidators = Astro.utils.validators.parseValidators(param);

  _.every(fieldValidators, function(fieldValidator, validatorName) {
    // Get validator.
    let validator = Validators[fieldValidator.name];
    // Execute single validator.
    validator(doc, name, fieldValidator.param);
  });
};