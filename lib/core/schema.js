var checkSchemaDefinition = function(schemaDefinition) {
  // Schema definition has to be an object.
  if (!_.isObject(schemaDefinition)) {
    throw new Error('The class definition has to be an object');
  }
  // The class name has to be a string.
  if (_.has(schemaDefinition, 'name') && !_.isString(schemaDefinition.name)) {
    throw new Error('The "class" property has to be a string');
  }
};

var checkSchema = function() {
  var schema = this;

  // Check for class name existence.
  if (!_.has(schema, 'className')) {
    throw new Error('The class name has to be provided in the "name" property');
  }
  // Class name has to be a string.
  if (!_.isString(schema.className)) {
    throw new Error('The "name" property has to be a string');
  }
  // Check if the there already is a class with the given name.
  var Class = Astro.getClass(schema.className);
  if (Class) {
    throw new Error(
      'A class with the "' + schema.className +
      '" name had already been defined'
    );
  }
};

Astro.Schema = function Schema(schemaDefinitions) {
  var schema = this;

  // One schema can be created from many schema definitions that we store in the
  // "definitions" property. Many schema definitions are present on the class
  // inheritance.
  schema.definitions = [];

  // Setup schema using the "initSchema" event handlers.
  _.each(schemaDefinitions, function(schemaDefinition) {
    checkSchemaDefinition.call(schema, schemaDefinition);

    schema.definitions.push(schemaDefinition);
    if (_.has(schemaDefinition, 'name')) {
      schema.className = schemaDefinition.name;
    }

    Astro.eventManager.each('initSchema', function(eventHandler) {
      eventHandler.call(schema, schemaDefinition);
    });
  });

  // Check if the schema has all the necessary properties.
  checkSchema.call(schema);
};
