var checkSchemaDefinition = function(schemaDefinition) {

};

Astro.eventManager.on('initSchema', function(schemaDefinition) {
  var schema = this;

  // Set collection for schema.
  if (_.has(schemaDefinition, 'collection')) {
    schema.collection = schemaDefinition.collection;
    if (_.has(schemaDefinition, 'transform')) {
      schema.transform = schemaDefinition.transform;
    }
    if (_.has(schemaDefinition, 'typeField')) {
      schema.typeField = schemaDefinition.typeField;
    }
  }
});
