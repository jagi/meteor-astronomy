Astro.Module.modules.validators.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, ClassName
) {
  _.each(sourceDefinition.validators, function(validators, fieldName) {
    targetDefinition.validators[fieldName] =
      targetDefinition.validators[fieldName] || [];
    targetDefinition.validators[fieldName] =
      targetDefinition.validators[fieldName].concat(validators);
  });

  targetDefinition.resolveError = sourceDefinition.resolveError;
};