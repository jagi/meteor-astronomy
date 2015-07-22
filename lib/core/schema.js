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

    // If a class to extend from is provided than check if its prototype is
    // an instance of the "Astro.base.Class" class.
    if (_.has(schemaDefinition, 'parentClassName')) {
      var Class = Astro.classes[schemaDefinition.parentClassName];
      if (!Class) {
        throw new Error('The class to extend from does not exist');
      }
      if (!(Class.prototype instanceof Astro.base.Class)) {
        throw new Error('The class to extend from is not valid');
      }
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
  checks.schemaDefinition(schemaDefinition);

  this.className = schemaDefinition.name;

  // Set collection for schema.
  if (_.has(schemaDefinition, 'collection')) {
    this.collection = schemaDefinition.collection;

    // If there is not "transform" property then set it to true by default.
    if (!_.has(schemaDefinition, 'transform')) {
      schemaDefinition.transform = true;
    }

    // Set document transformation, if "transform" flag is set.
    if (schemaDefinition.transform) {
      this.collection._transform = LocalCollection.wrapTransform(
        Astro.utils.class.transform(this.className)
      );
    }
  }

  // Set the class to extend from.
  if (_.has(schemaDefinition, 'parentClassName')) {
    this.parentClassName = schemaDefinition.parentClassName;
  }

  // Set class constructor.
  this.init = function() {
    // Call init (constructor) method if provided by user.
    if (_.isFunction(schemaDefinition.init)) {
      schemaDefinition.init.apply(this, arguments);
    }
  };
};
