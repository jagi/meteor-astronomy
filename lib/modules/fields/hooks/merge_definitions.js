Astro.Module.modules.fields.onMergeDefinitions = function(
  schemaSchema, extendSchema, className
) {
  // Add fields.
  _.each(extendSchema.fields, function(fieldDefinition, fieldName) {
    schemaSchema.fields[fieldName] = fieldDefinition;
  });

  // Add nested fields.
  _.each(extendSchema.nested, function(fieldDefinition, fieldName) {
    schemaSchema.nested[fieldName] = fieldDefinition;
  });
};
