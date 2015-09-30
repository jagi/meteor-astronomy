Astro.eventManager.on(
  'initSchema', function onInitSchemaMethods(schemaDefinition) {
    var schema = this;

    schema.methods = schema.methods || {};

    if (_.has(schemaDefinition, 'methods')) {
      _.extend(schema.methods, schemaDefinition.methods);
    }
  }
);
