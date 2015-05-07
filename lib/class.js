var extend = function(definition) {
  var Class = this;

  // Remove `transform` attribute if it's provided. We don't want to override
  // collection's already set transform function.
  delete definition.transform;

  // Add the class from which we want to extend.
  definition.extend = Class;

  // If collection in the parent class was defined, then we want to use this
  // collection in the child class and override it if needed.
  var parentCollection = Class.schema.getCollection();
  if (parentCollection) {
    definition.collection = parentCollection;
  }

  return Astro.Class(definition);
};

var validateDefinition = function(definition) {
  // Check if class definition is provided.
  if (_.isUndefined(definition) || _.isNull(definition)) {
    throw new Error('The class definition has to be provided');
  }
  // Check whether definition is object.
  if (!_.isObject(definition)) {
    throw new Error('The class definition has to be an object');
  }
  // Check if class name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('The class name has to be provided');
  }
  // Check if class name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('The class name has to be a string');
  }
  // Check if a class with the given name already exists.
  if (_.has(Classes, definition.name)) {
    throw new Error(
      'The class with the name "' + definition.name +
      '" is already defined'
    );
  }
  // If collection is provided, then check its validity.
  if (_.has(definition, 'collection') &&
    !(definition.collection instanceof Mongo.Collection)) {
    throw new Error(
      'The collection has to be an instance of the "Mongo.Collection"'
    );
  }
  // If class to extend from is provided, then check its validity. First, check
  // whether it's fuction. Later, if it has schema defined and finally check if
  // schema is instance of Astro.Schema.
  if (_.has(definition, 'extend') &&
    (!_.isFunction(definition.extend) ||
      !_.has(definition.extend, 'schema') ||
      !(definition.extend.schema instanceof Astro.Schema)
    )) {
    throw new Error('The class to extend from is not valid');
  }
  // If class constructor is provided, then check its validity.
  if (_.has(definition, 'init') && !_.isFunction(definition.init)) {
    throw new Error('The class constructor has to be a function');
  }
};

Astro.Class = function(definition) {
  validateDefinition(definition);

  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use "new" keyword to create an instance');
    }

    // Call constructor.
    this.constructor.schema.getInit().apply(this, arguments);
  };

  // Add extend function to class object.
  Class.extend = extend;

  // Initialize schema and store it in the class object.
  Class.schema = new Astro.Schema(Class, definition);

  // Add list of all parent schemas including this class schema.
  var ParentClass = Class.schema.getParentClass();
  if (ParentClass) {
    Class.schemas = ParentClass.schemas.concat(Class.schema);
  } else {
    Class.schemas = [Class.schema];
  }

  // Setup schema using modules.
  _.each(Modules, function(Module) {
    if (_.has(Module, 'initSchema')) {
      Module.initSchema.call(Class.schema, Class, definition);
    }
  });

  // Setup class using modules.
  _.each(Modules, function(Module) {
    if (_.has(Module, 'initClass')) {
      Module.initClass.call(Class);
    }
  });

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Classes[definition.name] = Class;

  return Class;
};
