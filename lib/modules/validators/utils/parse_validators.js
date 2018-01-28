import _each from 'lodash/each';
import _has from 'lodash/has';
import _union from 'lodash/union';
import throwParseError from '../../core/utils/throw_parse_error.js';
import Validators from '../validators.js';

const validatorsPattern = [{
  type: String,
  param: Match.Optional(Match.Any),
  resolveParam: Match.Optional(Function),
  message: Match.Optional(String),
  resolveError: Match.Optional(Function)
}];

function parseValidators(validators, parseContext) {
  // Validators list is an array of object that should include at least the
  // "type" property.
  if (validators && !Match.test(validators, validatorsPattern)) {
    throwParseError(_union(
      parseContext, ['Validators definition has to be an array of objects']
    ));
  }

  _each(validators, function(validator) {
    // Check if a validator of a given type exists.
    if (!_has(Validators, validator.type)) {
      throwParseError(_union(
        parseContext, [`There is no "${validator.type}" validator`]
      ));
    }
  });
};

export default parseValidators;