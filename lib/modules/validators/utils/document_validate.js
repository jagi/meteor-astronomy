const catchValidationError = function(
  callback, errors, stopOnFirstError, prefix
) {
  try {
    callback();
  }
  catch (err) {
    // If it's Astro.ValidationError.
    if (Astro.ValidationError.check(err)) {
      // Add pattern if an error comes from the nested field.
      _.forEach(err.details, function(details) {
        details.pattern = prefix ? prefix + details.name : details.name;
      });

      // If we stop on first error then just throw error again.
      if (stopOnFirstError) {
        throw err;
      }
      // Otherwise we collect errors.
      else {
        _.forEach(err.details, function(details) {
          errors.push(details);
        });
      }
    }
    // It it's not Astro.ValidationError, then we throw error again.
    else {
      throw err;
    }
  }
};

Astro.utils.validators.documentValidate = function(
	doc, fieldsNames, stopOnFirstError
) {
  let Class = doc.constructor;

  // Prepare array for storing errors list.
  let errors = [];

  _.forEach(fieldsNames, function(name) {
    let field = Class.getField(name);

    // We do not validate transient fields.
    if (field.transient) {
      return;
    }

    // Get value of the field.
    let value = doc.get(name);

    // Execute validation in the try-catch block. That's because we want to
    // continue validation if the "stopOnFirstError" flag is set to false.
    catchValidationError(function() {
      // First, execute type validators.
      field.validate({ doc, name, value });
      // Get validators for a given field.
      let validators = Class.getValidators(name);
      _.forEach(validators, function({
        type, param, resolveParam, error, resolveError
      }) {
        // Get validation helper function.
        let validationFunction = Validators[type];
        // Execute single validator.
        validationFunction({
          doc, name, value, param, resolveParam, error, resolveError
        });
      });
    }, errors, stopOnFirstError);

    // If it is the object field then validate it.
    if (field instanceof Astro.ObjectField) {
      if (value instanceof Astro.Class) {
        catchValidationError(function() {
          value.validate(stopOnFirstError);
        }, errors, stopOnFirstError, field.name + '.');
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof Astro.ListField && field.class) {
      _.forEach(value, function(element, index) {
        if (element instanceof Astro.Class) {
          catchValidationError(function() {
            element.validate(stopOnFirstError);
          }, errors, stopOnFirstError, field.name + '.' + index + '.');
        }
      });
    }
  });

  // If we have not thrown any error yet then it means that there were no errors
  // or we do not throw on the first error.
  if (errors.length > 0) {
    throw new Astro.ValidationError(errors, errors[0].error);
  }
};