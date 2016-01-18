Astro.Validator.create({
  name: 'and',
  parseParam(param) {
    Astro.utils.validators.parseValidators(param);
  },
  isValid({ doc, name, value, param: validators }) {
    _.every(validators, function(validator) {
      // Get validator.
      let validationFunction = Validators[validator.type];
      // Execute single validator.
      validationFunction({
        doc, name, value, param: validator.param
      });
    });

    return value.length === param;
  }
});