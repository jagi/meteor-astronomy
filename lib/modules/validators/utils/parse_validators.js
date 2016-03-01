import throwParseError from '../../../core/utils/throw_parse_error.js';
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
    throwParseError(_.union(
      parseContext, ['Validators definition has to be an array of objects']
    ));
  }

  _.forEach(validators, function(validator) {
    // Check if a validator of a given type exists.
    if (!_.has(Validators, validator.type)) {
      throwParseError(_.union(
        parseContext, [`There is no "${validator.type}" validator`]
      ));
    }
  });
};

export default parseValidators;