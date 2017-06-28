import _some from 'lodash/some';
import parseValidators from '../../utils/parse_validators.js';
import Validator from '../../validator.js';
import Validators from '../../validators.js';
import { ValidationError } from 'meteor/mdg:validation-error';

Validator.create({
  name: 'or',
  parseParam(param) {
    parseValidators(param);
  },
  validate({
    doc,
    name,
    value,
    param: validators
  }) {
    let firstError;
    const isValid = _some(validators, function(validator) {
      // Get validator.
      const validationFunction = Validators[validator.type];
      // Execute single validator.
      try {
        validationFunction({
          doc,
          name,
          value,
          param: validator.param
        });
        return true;
      }
      catch (err) {
        if (ValidationError.is(err)) {
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

    if (!isValid) {
      throw firstError;
    }
  }
});