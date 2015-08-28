Astro.classes = {};

Astro.getClass = function(className) {
  return Astro.classes[className];
};

var methods = {
  getName: function() {
    return this.schema.className;
  },

  getCollection: function() {
    return this.schema.collection;
  },

  getParent: function() {
    return Astro.classes[this.schema.parentClassName];
  },

  getTransform: function() {
    return this.schema.transform;
  },

  getTypeField: function() {
    return this.schema.typeField;
  },

  extend: function(schemaDefinition) {
    var ParentClass = this;

    schemaDefinition.extend = ParentClass.getName();

    return Astro.Class(schemaDefinition);
  }
};

Astro.createClass = Astro.Class = function(schemaDefinition) {
  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use the "new" keyword to create an instance');
    }

    var doc = this;
    var args = arguments;

    // Call default constructor.
    Astro.BaseClass.apply(doc, args);
  };

  // Extend class object with some helper methods.
  _.extend(Class, methods);

  // Initialize a schema and store it in the class object.
  Class.schema = new Astro.Schema(schemaDefinition);

  // Add given class to list of all defined classes.
  Astro.classes[Class.getName()] = Class;

  // Extend base class.
  var ParentClass = Class.getParent();
  // Extend another model class if provided.
  if (ParentClass) {
    Class.prototype = Object.create(ParentClass.prototype);
  } else {
    // Class.prototype = Object.create(Astro.BaseClass.prototype);
    Class.prototype = Object.create(Astro.BaseClass.prototype);
  }
  Class.prototype.constructor = Class;

  var Collection = Class.getCollection();
  if (Collection) {
    if (true) {
      var transform = Class.getTransform();
      if (_.isFunction(transform)) {
        // Apply custom transformation function.
        Collection._transform = Astro.utils.class.transform(transform);
      } else if (_.isUndefined(transform) && !Collection._transform) {
        // Apply standard transformation function, if the transform function was
        // not provided and the collection does not have the transform function
        // yet.
        Collection._transform = Astro.utils.class.transformToClass(
          Class.getName()
        );
      }
    }
  }

  // Setup class using the "initClass" event handlers.
  if (ParentClass) {
    Astro.eventManager.each('initClass', function(eventHandler) {
      eventHandler.call(Class, ParentClass.schema.definition);
    });
  }
  Astro.eventManager.each('initClass', function(eventHandler) {
    eventHandler.call(Class, schemaDefinition);
  });

  return Class;
};
