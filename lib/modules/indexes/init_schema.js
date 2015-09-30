Astro.eventManager.on(
  'initSchema', function onInitSchemaIndexes(schemaDefinition) {
    var schema = this;

    // Add the "indexes" attribute to the schema.
    schema.indexes = schema.indexes || {};

    if (_.has(schemaDefinition, 'indexes')) {
      _.extend(schema.indexes, schemaDefinition.indexes);
    }
  }
);
