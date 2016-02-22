import parseValidators from '../../utils/parse_validators.js';
import Validator from '../../validator.js';
import Validators from '../../validators.js';
import ValidationError from '../../validation_error.js';

Validator.create({
  name: 'or',
  parseParam(param) {
    parseValidators(param);
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
        if (ValidationError.check(err)) {
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