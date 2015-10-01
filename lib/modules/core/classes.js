Astro.getClass = function(className) {
  return Astro.classes[className];
};

var methods = {
  getName: function() {
    return this.schema.className;
  },

  getParent: function() {
    return Astro.getClass(this.schema.parentClassName);
  },

  inherit: function(schemaDefinition) {
    var ParentClass = this;

    schemaDefinition.inherit = ParentClass.getName();

    return Astro.Class(schemaDefinition);
  },

  extend: function(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    Astro.eventManager.each('initDefinition', function(eventHandler) {
      eventHandler.call(Class, schemaDefinition);
    });
    // Store the schema definition.
    schema.definitions.push(schemaDefinition);

    // Setup schema with the schema definition.
    Astro.eventManager.each('initSchema', function(eventHandler) {
      eventHandler.call(schema, schemaDefinition);
    });
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
    Astro.utils.class.inherits(Class, ParentClass);
  } else {
    Astro.utils.class.inherits(Class, Astro.BaseClass);
  }

  // Setup class using the "initClass" event handlers.
  Astro.eventManager.each('initClass', function(eventHandler) {
    eventHandler.call(Class);
  });

  Class.extend(schemaDefinition);

  return Class;
};
