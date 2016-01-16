Astro.Module.modules.validators.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {
    validators: {}
  };

  _.each(definition.fields, function(fieldDefinition, fieldName) {
    if (_.has(fieldDefinition, 'validators')) {
      parsedDefinition.validators[fieldName] =
        Astro.utils.validators.parseValidators(fieldDefinition.validators);
      fieldDefinition.validators = undefined;
    }
  });

  _.each(definition.validators, function(validators, fieldName) {
    parsedDefinition.validators[fieldName] =
      Astro.utils.validators.parseValidators(validators);
  });

  return parsedDefinition;
};