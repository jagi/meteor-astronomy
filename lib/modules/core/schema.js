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

  // Process the schema definition before using it.
  Astro.eventManager.each('initDefinition', function(eventHandler) {
    eventHandler(schemaDefinition);
  });
  // Store the schema definition.
  schema.definitions = [schemaDefinition];

  // Store class name.
  if (_.has(schemaDefinition, 'name')) {
    schema.className = schemaDefinition.name;
  }

  // Store parent class name.
  if (_.has(schemaDefinition, 'inherit')) {
    schema.parentClassName = schemaDefinition.inherit;

    // Setup schema with the parent class definition.
    var ParentClass = Astro.getClass(schema.parentClassName);
    var parentSchemaDefinitions = ParentClass.schema.definitions;
    _.each(parentSchemaDefinitions, function(parentSchemaDefinition) {
      Astro.eventManager.each('initSchema', function(eventHandler) {
        eventHandler.call(schema, parentSchemaDefinitions);
      });
    });
  }

  // Setup schema with the definition.
  Astro.eventManager.each('initSchema', function(eventHandler) {
    eventHandler.call(schema, schemaDefinition);
  });
};
