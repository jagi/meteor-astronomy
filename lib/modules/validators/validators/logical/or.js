Astro.Validator.create({
  name: 'or',
  parseParam(param) {
    Astro.utils.validators.parseValidators(param);
  },
  isValid({ doc, name, value, param: validators }) {
    let firstError;
    let isValid = _.some(validators, function(validator) {
      // Get validator.
      let validationFunction = Validators[validator.type];
      // Execute single validator.
      try {
        validationFunction({
          doc, name, value, param: validator.param
        });
        return true;
      }
      catch (err) {
        if (Astro.ValidationError.check(err)) {
          // Collect only the first error that occured.
          if (!firstError) {
            firstError = err;
          }
          return false;
        }
        else {
          throw err;
        }
      }
    });

    if (isValid) {
      return true;
    }
    else {
      throw firstError;
    }

    return value.length === param;
  }
});