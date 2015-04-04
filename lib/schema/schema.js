var defaults = {
  validator: function() {
    return true;
  }
};

var initSchema = function(Class, definition) {
  var self = this;

  // Check parameters validity.
  if (!_.isObject(definition)) {
    throw new Error('Pass class definition');
  }
  // Check if class name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('Pass class name');
  }
  // Check if class name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('Class name has to be string');
  }
  // Check if class with given name already exists.
  if (_.has(Astronomy._classes, definition.name)) {
    throw new Error('Class with the name `' + definition.name +
      '` is already defined');
  }

  // Add `fields` attribute if it's not defined in the schema definition.
  definition.fields = definition.fields || {};

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Astronomy._classes[definition.name] = Class;

  this._name = definition.name;
  this._class = Class;
  this._collection = null;
  this._extend = null;
  this._init = null;
  this._fields = {};
  this._methods = {};
  this._events = {};
  this._validators = {};
  this._behaviors = {};

  // Set collection for schema.
  if (definition.collection && definition.collection instanceof Mongo.Collection) {
    this._collection = definition.collection;

    // Set document transformation, if `transform` flag is set.
    if (definition.transform) {
      this._collection._transform = LocalCollection.wrapTransform(
        Astronomy.transform(this._name)
      );
    }
  }

  // Set class to extend from if defined.
  if (_.isFunction(definition.extend)) {
    this._extend = definition.extend;
  }

  // Set constructor for class.
  this._init = function() {
    // Create empty object per instance for storing object's values.
    this._values = {};
    // Create empty object per instance for storing object's modified values.
    this._modified = {};
    // By default constructor is taking first argument which should be an object
    // and applies it to the `_value`.
    var attrs = arguments[0];
    if (_.isObject(attrs)) {
      this._values = attrs;
    }
    // Call user constructor if defined.
    if (_.isFunction(definition.init)) {
      definition.init.apply(this, arguments);
    }
  };
};

Schema = function(Class, definition) {
  // Initialize schema.
  initSchema.call(this, Class, definition);

  // Extend.
  var Class = this._class;
  var ParentClass = this.getParentClass();
  // Extend another model class if provided.
  if (ParentClass) {
    var Surrogate = function() {
      this.constructor = Class;
    };
    Surrogate.prototype = ParentClass.prototype;
    Class.prototype = new Surrogate;
    // Define field for storing child model name.
    definition.fields._type = this.getName();
  } else {
    // Create empty prototype object otherwise.
    Class.prototype = {};
  }
  Class.prototype.constructor = Class;

  definition.fields._id = null;

  // Setup other options.
  if (definition.events) {
    this.addEvents(definition.events);
  }
  if (definition.fields) {
    this.addFields(definition.fields);
  }
  if (definition.methods) {
    this.addMethods(definition.methods);
  }
  if (definition.validators) {
    this.addValidators(definition.validators);
  }
  if (definition.behaviors) {
    this.addBehaviors(definition.behaviors);
  }
};

Schema.prototype.getName = function() {
  return this._name;
};

Schema.prototype.getCollection = function() {
  var schema = this;

  // Get collection from this schema or from parent classes' schema.
  while (!schema._collection) {
    var ParentClass = schema.getParentClass();
    if (!ParentClass) {
      return;
    }
    schema = ParentClass.schema;
  }

  return schema._collection;
};

Schema.prototype.init = function() {
  return this._init;
};

Schema.prototype.getParentClass = function() {
  return this._extend;
};
