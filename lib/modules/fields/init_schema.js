var addField = function(fieldName, fieldDefinition) {
  var schema = this;

  // Get a field class from the type.
  var Field = Astro.fields[fieldDefinition.type];
  // Create a new field.
  var field = new Field(fieldDefinition);

  // Add field definition to the schema.
  schema.fields[fieldName] = field;
  // Add the field name to the list of all fields.
  schema.fieldsNames.push(fieldName);
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaFields(schemaDefinition) {
    var schema = this;

    // Add the "fields" attribute to the schema.
    schema.fields = schema.fields || {};
    // Add the "fieldsNames" attribute to the schema.
    schema.fieldsNames = schema.fieldsNames || [];

    // Add fields from the schema definition.
    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        addField.call(schema, fieldName, fieldDefinition);
      });
    }
  }
);
