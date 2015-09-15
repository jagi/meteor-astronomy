var addIndex = function(indexName, indexDefinition) {
  var schema = this;

  // Add an index to the schema.
  schema.indexes[indexName] = indexDefinition;
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaIndexes(schemaDefinition) {
    var schema = this;

    // Add the "indexes" attribute to the schema.
    schema.indexes = schema.indexes || {};

    // Add indexes from the schema definition.
    if (_.has(schemaDefinition, 'indexes')) {
      _.each(schemaDefinition.indexes, function(indexDefinition, indexName) {
        addIndex.call(schema, indexName, indexDefinition);
      });
    }
  }
);
