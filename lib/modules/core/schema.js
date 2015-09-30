var checkSchemaDefinition = function(schemaDefinition) {
  // The schema definition has to be an object.
  if (!Match.test(schemaDefinition, Object)) {
    throw new Error('The class definition has to be an object');
  }
  // The class name has to be a string.
  if (!Match.test(schemaDefinition.name, String)) {
    throw new Error('The "name" property has to be a string');
  }
};

Astro.Schema = function Schema(schemaDefinition) {
  var schema = this;

  checkSchemaDefinition.call(schema, schemaDefinition);

  // Store the schema definition.
  schema.definitions = [];

  // Store class name.
  if (_.has(schemaDefinition, 'name')) {
    schema.className = schemaDefinition.name;
  }

  // Store parent class name.
  if (_.has(schemaDefinition, 'inherit')) {
    schema.parentClassName = schemaDefinition.inherit;
  }
};
