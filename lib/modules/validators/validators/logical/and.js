import _each from 'lodash/each';
import parseValidators from '../../utils/parse_validators.js';
import Validator from '../../validator.js';
import Validators from '../../validators.js';

Validator.create({
  name: 'and',
  parseParam(param) {
    parseValidators(param);
  },
  validate({
    doc,
    name,
    value,
    param: validators
  }) {
    _each(validators, function(validator) {
      // Get validator.
      const validationFunction = Validators[validator.type];
      // Execute single validator.
      validationFunction({
        doc,
        name,
        value,
        param: validator.param
      });
    });
  }
});