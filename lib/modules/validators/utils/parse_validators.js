const validatorsPattern = [{
  type: String,
  param: Match.Optional(Match.Any),
  resolveParam: Match.Optional(Function),
  error: Match.Optional(String),
  resolveError: Match.Optional(Function)
}];

const validatorTypeExists = function(type) {
  // If there is no validator with a given name then throw TypeError.
  if (!_.has(Validators, type)) {
    throw new TypeError(
      `There is no "${type}" validator`
    );
  }
};

Astro.utils.validators.parseValidators = function(validators) {
  // Validators list is an array of object that should include at least the
  // "type" property.
  if (!Match.test(validators, validatorsPattern)) {
    Astro.utils.core.throwParseError([
      {class: className}, {'schema property': 'fields'},
      {field: fieldName}, {'field property': 'validators'},
      'Validators definition has to be an object or array of objects ' +
      'or strings'
    ]);
  }

  _.forEach(validators, function(validator) {
    validatorTypeExists(validator.type);
  });
};