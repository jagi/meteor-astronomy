const exists = function(validatorName) {
  // If there is no validator with a given name then throw TypeError.
  if (!_.has(Validators, validatorName)) {
    throw new TypeError(
      `There is no validator with the "${validatorName}" name`
    );
  }
};

Astro.utils.validators.parseValidators = function(validators) {
  let parsedValidators = [];

  // If list of validators is object, then it has to have form
  // { VALIDATOR_NAME: VALIDATOR_PARAM, VALIDATOR_NAME: VALIDATOR_PARAM, ... }
  if (Match.test(validators, Object)) {
    _.forOwn(validators, function(
      validatorParam, validatorName
    ) {
      exists(validatorName);
      parsedValidators.push({
        name: validatorName,
        param: validatorParam
      })
    });
  }
  // If list of validators is array, then it has to contain strings or
  // objects in form { name: VALIDATOR_NAME, [param: VALIDATOR_PARAM] }.
  else if (
    Match.test(
      validators,
      [Match.OneOf(
        String,
        { name: String, param: Match.Optional(Match.Any) }
      )]
    )
  ) {
    _.forEach(validators, function(validator) {
      if (Match.test(validator, String)) {
        exists(validator);
        parsedValidators.push({
          name: validator,
          param: null
        });
      } else {
        exists(validator.name);
        parsedValidators.push({
          name: validator.name,
          param: validator.param
        });
      }
    });
  } else {
    Astro.utils.core.throwParseError([
      {class: className}, {'schema property': 'fields'},
      {field: fieldName}, {'field property': 'validators'},
      'Validators definition has to be an object or array of objects ' +
      'or strings'
    ]);
  }

  return parsedValidators;
};