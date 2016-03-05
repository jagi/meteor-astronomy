import parseValidators from '../../utils/parse_validators.js';
import Validator from '../../validator.js';
import Validators from '../../validators.js';

Validator.create({
  name: 'and',
  parseParam(param) {
    parseValidators(param);
  },
  isValid({ doc, name, value, param: validators }) {
    if (_.isNil(value)) {
      return true;
    }

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