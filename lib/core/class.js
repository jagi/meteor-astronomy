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
    // an instance of the "Astro.BaseClass" class.
    if (_.has(schemaDefinition, 'parentClassName')) {
      var Class = Astro.classes[schemaDefinition.parentClassName];
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
  }
};

var methods = {
  extend: function(schemaDefinition) {
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
  },

  getParent: function() {
    return Astro.classes[this.schema.parentClassName];
  },

  getName: function() {
    return this.schema.className;
  },

  getCollection: function() {
    return this.schema.collection;
  },

  getConstructor: function() {
    return this.schema.init;
  }
};

Astro.createClass = Astro.Class = function(schemaDefinition) {
  checks.schemaDefinition(schemaDefinition);

  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use "new" keyword to create an instance');
    }

    var self = this;
    var args = arguments;

    // Call default constructor.
    defaultConstructor.apply(self, args);

    // Call global constructors by triggering the "initinstance" event. These
    // constructors are mainly defined by modules and behaviors.
    Astro.eventManager.each('initinstance', function(eventHandler) {
      eventHandler.apply(self, args);
    });

    // Call user defined constructor.
    self.constructor.getConstructor().apply(self, args);
  };

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Astro.classes[schemaDefinition.name] = Class;

  // Extend class object with some helper methods.
  _.extend(Class, methods);

  // Initialize schema and store it in the class object.
  Class.schema = new Astro.Schema(schemaDefinition);

  // Extend.
  var ParentClass = Class.getParent();
  // Extend another model class if provided.
  if (ParentClass) {
    Class.prototype = Object.create(ParentClass.prototype);
  } else {
    // Class.prototype = Object.create(Astro.BaseClass.prototype);
    Class.prototype = Object.create(Astro.BaseClass.prototype);
  }
  Class.prototype.constructor = Class;

  // Setup class using "initclass" event handlers.
  Astro.eventManager.each('initclass', function(eventHandler) {
    eventHandler.call(Class, schemaDefinition);
  });

  return Class;
};
