var checks = {
  schemaDefinition: function(schemaDefinition) {
    // Check whether definition is object.
    if (!_.isObject(schemaDefinition)) {
      throw new Error('The class definition has to be an object');
    }

    // Check if class name is provided.
    if (!_.has(schemaDefinition, 'name')) {
      throw new Error('The class name has to be provided');
    }

    // Check if class name is a string.
    if (!_.isString(schemaDefinition.name)) {
      throw new Error('The class name has to be a string');
    }

    // Check if a class with the given name already exists.
    if (_.has(Astro.classes, schemaDefinition.name)) {
      throw new Error(
        'The class with the name "' + schemaDefinition.name +
        '" is already defined'
      );
    }

    // If collection is provided, then check its validity.
    if (
      _.has(schemaDefinition, 'collection') &&
      !(schemaDefinition.collection instanceof Mongo.Collection)
    ) {
      throw new Error(
        'The collection has to be an instance of the "Mongo.Collection"'
      );
    }

    // If class constructor is provided, then check its validity.
    if (
      _.has(schemaDefinition, 'init') &&
      !_.isFunction(schemaDefinition.init)
    ) {
      throw new Error('The class constructor has to be a function');
    }
  }
};

Astro.Schema = function(schemaDefinition) {
  var schema = this;

  checks.schemaDefinition(schemaDefinition);

  schema.className = schemaDefinition.name;
  schema.typeField = schemaDefinition.typeField || null;

  // Set collection for schema.
  if (_.has(schemaDefinition, 'collection')) {
    schema.collection = schemaDefinition.collection;
    schema.transform = schemaDefinition.transform;
  }

  // Set class constructor.
  schema.init = function() {
    // Call init (constructor) method if provided by user.
    if (_.isFunction(schemaDefinition.init)) {
      schemaDefinition.init.apply(this, arguments);
    }
  };
};
