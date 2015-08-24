var checkSchemaDefinition = function(schemaDefinition) {
  // The collection has to be an instance of the Mongo.Collection class.
  if (_.has(schemaDefinition, 'collection') &&
    !(schemaDefinition.collection instanceof Mongo.Collection)
  ) {
    throw new Error(
      'The "collection" property has to be an instance of the ' +
      '"Mongo.Collection"'
    );
  }
  // The "typeField" property has to be a string.
  if (_.has(schemaDefinition, 'typeField') &&
    !_.isString(schemaDefinition.typeField)
  ) {
    throw new Error('The "typeField" property has to be a string');
  }
};

Astro.eventManager.on('initSchema', function(schemaDefinition) {
  var schema = this;
  checkSchemaDefinition.call(schema, schemaDefinition);

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
