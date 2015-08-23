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

  getConstructor: function() {
    return this.schema.init;
  },

  getTransform: function() {
    return this.schema.transform;
  },

  getTypeField: function() {
    return this.schema.typeField;
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
  Class.prototype = Object.create(Astro.BaseClass.prototype);
  Class.prototype.constructor = Class;

  var Collection = Class.getCollection();
  if (Collection) {
    // Apply transform function.
    if (!Collection._transform) {
      var transform = Class.getTransform();
      if (_.isFunction(transform)) {
        // Apply custom transformation function.
        Collection._transform = Astro.utils.class.transform(transform);
      } else if (_.isUndefined(transform)) {
        // If a transform function was not provided and it also was not set to
        // null. Then, we apply standard transform function.
        Collection._transform = Astro.utils.class.transformToClass(
          Class.getName()
        );
      }
    }
  }

  // Setup class using the "initClass" event handlers.
  Astro.eventManager.each('initClass', function(eventHandler) {
    eventHandler.call(Class, schemaDefinition);
  });

  return Class;
};
