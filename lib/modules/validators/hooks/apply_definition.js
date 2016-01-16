Astro.Module.modules.validators.onApplyDefinition = function(
  Class, parsedDefinition, className
) {
  _.each(parsedDefinition.validators, function(validators, fieldName) {
    Class.schema.validators[fieldName] =
      Class.schema.validators[fieldName] || [];
    _.each(validators, function(validator) {
      Class.schema.validators[fieldName] =
        Class.schema.validators[fieldName].concat(validator);
    });
  });
};