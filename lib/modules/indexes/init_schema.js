Astro.eventManager.on('initSchema', function(schemaDefinition) {
  var schema = this;

  // Add the "indexes" attribute to the schema.
  schema.indexes = schema.indexes || {};
});
