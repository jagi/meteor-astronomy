Astro.eventManager.on(
  'initSchema', function onInitSchemaBehavior(schemaDefinition) {
    var schema = this;

    schema.behaviors = schema.behaviors || {};

    if (_.has(schemaDefinition, 'behaviors')) {
      _.extend(schema.behaviors, schemaDefinition.behaviors);
    }
  }
);
