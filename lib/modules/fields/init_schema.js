Astro.eventManager.on(
  'initSchema', function onInitSchemaFields(schemaDefinition) {
    var schema = this;

    schema.fields = schema.fields || {};
    schema.fieldsNames = schema.fieldsNames || [];

    if (_.has(schemaDefinition, 'fields')) {
      _.extend(schema.fields, schemaDefinition.fields);
      schema.fieldsNames = _.union(
        schema.fieldsNames, _.keys(schemaDefinition.fields)
      );
    }
  }
);
