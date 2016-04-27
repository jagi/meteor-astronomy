import _ from 'lodash';
import parseValidators from '../../utils/parse_validators.js';
import Validator from '../../validator.js';
import Validators from '../../validators.js';

Validator.create({
  name: 'every',
  parseParam(param) {
    parseValidators(param);
  },
  validate({
    doc,
    name,
    nestedName,
    value,
    param: validators
  }) {
    if (!_.isArray(value)) {
      throw new TypeError(
        `The "every" validator can only work with arrays`
      );
    }

    // Execute validators for each array element.
    _.each(value, function(element, index) {
      // Execute each validator.
      _.each(validators, function(validator) {
        // Get validator.
        const validationFunction = Validators[validator.type];
        // Execute single validator.
        validationFunction({
          doc,
          name: `${name}.${index}`,
          nestedName: `${nestedName}.${index}`,
          value: element,
          param: validator.param
        });
      });
    });
  }
});