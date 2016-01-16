Astro.Module.modules.fields.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, className
) {
  _.each(sourceDefinition.fields, function(fieldDefinition, fieldName) {
    targetDefinition.fields[fieldName] = fieldDefinition;
  });
};
