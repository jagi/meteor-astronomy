Astro.Module.modules.fields.onMergeDefinitions = function(
  schemaSchema, extendSchema, className
) {
  // Add fields.
  _.each(extendSchema.fields, function(fieldDefinition, fieldName) {
    schemaSchema.fields[fieldName] = fieldDefinition;
  });
};
