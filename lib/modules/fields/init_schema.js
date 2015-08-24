Astro.eventManager.on('initSchema', function(schemaDefinition) {
  var schema = this;

  // Add the "fields" attribute to the schema.
  schema.fields = schema.fields || {};
  // Add the "fieldsNames" attribute to the schema.
  schema.fieldsNames = schema.fieldsNames || [];
});
