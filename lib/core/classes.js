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
  },

  extend: function(schemaDefinition) {
    var Class = this;

    // Create new array of schema definitions starting from the child class
    // definition.
    var definitions = [schemaDefinition];
    // Loop through parent definitions and for each definition create a new one
    // with the "name" and "collection" properties omitted.
    _.each(Class.schema.definitions, function(definition) {
      definitions.push(_.omit(
        definition,
        ['name']
      ));
    });

    return Astro.Class(definitions);
  }
};

Astro.createClass = Astro.Class = function(schemaDefinitions) {
  if (!_.isArray(schemaDefinitions)) {
    schemaDefinitions = [schemaDefinitions];
  }

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
  Class.schema = new Astro.Schema(schemaDefinitions);

  // Add given class to list of all defined classes.
  Astro.classes[Class.getName()] = Class;

  // Extend base class.
  Class.prototype = Object.create(Astro.BaseClass.prototype);
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
  _.each(schemaDefinitions, function(schemaDefinition) {
    Astro.eventManager.each('initClass', function(eventHandler) {
      eventHandler.call(Class, schemaDefinition);
    });
  });

  return Class;
};
