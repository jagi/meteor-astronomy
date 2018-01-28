import _each from 'lodash/each';
import _isArray from 'lodash/isArray';
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
    if (!_isArray(value)) {
      throw new TypeError(
        `The "every" validator can only work with arrays`
      );
    }

    // Execute validators for each array element.
    _each(value, function(element, index) {
      // Execute each validator.
      _each(validators, function(validator) {
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