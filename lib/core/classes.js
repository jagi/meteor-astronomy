Astro.classes = {};

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
  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use the "new" keyword to create an instance');
    }

    var self = this;
    var args = arguments;

    // Call default constructor.
    defaultConstructor.apply(self, args);

    // Call global constructors by triggering the "initInstance" event. These
    // constructors are mainly defined by modules and behaviors.
    Astro.eventManager.each('initInstance', function(eventHandler) {
      eventHandler.apply(self, args);
    });

    // Call user defined constructor.
    self.constructor.getConstructor().apply(self, args);
  };

  // Extend class object with some helper methods.
  _.extend(Class, methods);

  // Initialize a schema and store it in the class object.
  Class.schema = new Astro.Schema(schemaDefinition);

  // Add given class to list of all defined classes.
  Astro.classes[Class.getName()] = Class;

  // Extend.
  var ParentClass = Class.getParent();
  // Extend another model class if provided.
  if (ParentClass) {
    Class.prototype = Object.create(ParentClass.prototype);
  } else {
    Class.prototype = Object.create(Astro.BaseClass.prototype);
  }
  Class.prototype.constructor = Class;

  // Setup class using the "initClass" event handlers.
  Astro.eventManager.each('initClass', function(eventHandler) {
    eventHandler.call(Class, schemaDefinition);
  });

  return Class;
};
