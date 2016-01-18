const methods = Astro.Module.modules.validators.classPrototypeMethods;

const catchValidationError = function(callback, errors, stopOnFirstError) {
  try {
    callback();
  }
  catch (err) {
    // If it's Astro.ValidationError.
    if (Astro.ValidationError.check(err)) {
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

methods.validate = function(fieldsNames, stopOnFirstError) {
  let doc = this;
  let Class = doc.constructor;

  // If there are no arguments, then get list of all fields in the proper
  // validation order.
  if (arguments.length === 0) {
    fieldsNames = Class.getValidationOrder();
  }
  // If there is one argument, then we have to check what it is.
  else if (arguments.length === 1) {
    // If it's string, then we're validating single field.
    if (Match.test(fieldsNames, String)) {
      fieldsNames = [fieldsNames];
    }
    // If it's boolean then it's the stopOnFirstError flag.
    else if (Match.test(fieldsNames, Boolean)) {
      // Rewrite value of the "fieldsNames" argument into the
      // "stopOnFirstError" argument.
      stopOnFirstError = fieldsNames;
      // Get list of all validators.
      fieldsNames = Class.getValidationOrder();
    }
  }
  // If there are two arguments, then we have all information...
  else if (arguments.length === 2) {
    // ... however we have to convert the first argument to array if it's not
    // already an array.
    if (Match.test(fieldsNames, String)) {
      fieldsNames = [fieldsNames];
    }
  }
  // By default, we stop on the first error.
  stopOnFirstError = stopOnFirstError === undefined ? true : stopOnFirstError;

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
    // Get validators for a given field.
    let validators = Class.getValidators(name);
    // If there are no valiators, then move on to the next field.
    if (validators) {
      // Execute validation in the try-catch block. That's because we want to
      // continue validation if the "stopOnFirstError" flag is set to false.
      catchValidationError(function() {
        _.forEach(validators, function({
          type, param, resolveParam, error, resolveError
        }) {
          // Get validator.
          let validationFunction = Validators[type];
          // Execute single validator.
          validationFunction({
            doc, name, value, param, resolveParam, error, resolveError
          });
        });
      }, errors, stopOnFirstError);
    }

    // If it is the object field then validate it.
    if (field instanceof Astro.ObjectField) {
      if (value instanceof Astro.Class) {
        catchValidationError(function() {
          value.validate(stopOnFirstError);
        }, errors, stopOnFirstError);
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof Astro.ListField && field.class) {
      _.forEach(value, function(element) {
        if (element instanceof Astro.Class) {
          catchValidationError(function() {
            element.validate(stopOnFirstError);
          }, errors, stopOnFirstError);
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