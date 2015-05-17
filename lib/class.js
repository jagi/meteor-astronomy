var checks = {};

checks.schemaDefinition = function(schemaDefinition) {
  // Check if class definition is provided.
  if (_.isUndefined(schemaDefinition) || _.isNull(schemaDefinition)) {
    throw new Error('The class definition has to be provided');
  }

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
  if (_.has(Classes, schemaDefinition.name)) {
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
  // an instance of the "Astro.BaseClass" class.
  if (_.has(schemaDefinition, 'parentClassName')) {
    var Class = Classes[schemaDefinition.parentClassName];
    if (!Class) {
      throw new Error('The class to extend from does not exist');
    }
    if (!(Class.prototype instanceof Astro.BaseClass)) {
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
};

var methods = {};

methods.extend = function(schemaDefinition) {
  // Remove the "transform" attribute if it's provided. We don't want to
  // override already set the collection's transform function.
  delete schemaDefinition.transform;

  // Add the class from which we want to extend.
  schemaDefinition.parentClassName = this.getName();

  // If a collection in the parent class was provided, then we want to use this
  // collection in the child class.
  var Collection = this.getCollection();
  if (Collection) {
    schemaDefinition.collection = Collection;
  }

  return Astro.Class(schemaDefinition);
};

methods.getParent = function() {
  return Classes[this.schema.parentClassName];
};

methods.getName = function() {
  return this.schema.className;
};

methods.getCollection = function() {
  return this.schema.collection;
};

methods.getConstructor = function() {
  return this.schema.init;
};

Astro.Class = function(schemaDefinition) {
  checks.schemaDefinition(schemaDefinition);

  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use "new" keyword to create an instance');
    }

    // Call constructor.
    this.constructor.getConstructor().apply(this, arguments);
  };

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Classes[schemaDefinition.name] = Class;

  // Extend class object with some helper methods.
  _.extend(Class, methods);

  // Initialize schema and store it in the class object.
  Class.schema = new Astro.Schema(schemaDefinition);

  // Add list of all parent schemas including this class schema.
  Class.schemas = [Class.schema];
  var ParentClass = Class.getParent();
  if (ParentClass) {
    Class.schemas = Class.schemas.concat(ParentClass.schemas);
  }

  // Setup class using modules.
  _.each(Modules, function(Module) {
    if (_.isFunction(Module.oninitclass)) {
      Module.oninitclass.call(Class, schemaDefinition);
    }
  });

  return Class;
};
