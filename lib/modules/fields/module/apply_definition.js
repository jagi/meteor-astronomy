Astro.Module.modules.fields.onApplyDefinition = function(
  Class, parsedSchema, className
) {
  let schema = Class.schema;

  _.each(parsedSchema.fields, function(fieldDefinition, fieldName) {
    // Create a new field.
    var field = new Astro.Field(fieldDefinition);
    // Add a field object to the fields list.
    schema.fields[fieldName] = field;
    schema.fieldsNames.push(fieldName);
  });

  _.each(parsedSchema.nested, function(fieldDefinition, fieldName) {
    // Create a new nested field.
    let nestedField = new Astro.NestedField(fieldDefinition);
    // Add a field object to the fields list.
    schema.nestedFields[fieldName] = nestedField;
    schema.nestedFieldsNames.push(fieldName);
  });

  // Add methods to the class prototype.
  _.extend(
    Class.prototype, Astro.Module.modules.fields.classPrototypeMethods
  );
};
