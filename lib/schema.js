var defaults = {
  validator: function() {
    return true;
  }
};

Astronomy.Schema = function(Class, definition) {
  this._name = definition.name;
  this._class = Class;

  // Set collection for schema.
  if (_.has(definition, 'collection')) {
    this._collection = definition.collection;

    // Set document transformation, if `transform` flag is set.
    if (_.has(definition, 'transform') && definition.transform) {
      this._collection._transform = LocalCollection.wrapTransform(
        Astronomy.Utils.transform(this.getName())
      );
    }
  }

  // Set class to extend from.
  if (_.has(definition, 'extend')) {
    this._extend = definition.extend;
  }

  // Set constructor for class.
  this._init = function(attrs) {
    // Create empty object per instance for storing object's values.
    this._values = {};
    // Create empty object per instance for storing object's modified values.
    this._modified = {};
    // By default constructor is taking first argument which should be an object
    // and applies it to the `_value`.
    if (_.isObject(attrs)) {
      this._values = attrs;
    }
    // Call user constructor if defined.
    if (_.has(definition, 'init')) {
      definition.init.apply(this, arguments);
    }
  };

  // Extend.
  var Class = this.getClass();
  var ParentClass = this.getParentClass();
  // Extend another model class if provided.
  if (ParentClass) {
    var Surrogate = function() {
      this.constructor = Class;
    };
    Surrogate.prototype = ParentClass.prototype;
    Class.prototype = new Surrogate;
  } else {
    // Create empty prototype object otherwise.
    Class.prototype = {};
  }
  Class.prototype.constructor = Class;

  // Setup schema using modules.
  _.each(Modules, function(Module) {
    if (_.has(Module, 'initSchema')) {
      Module.initSchema.call(this, Class, definition);
    }
  }, this);
};

Astronomy.Schema.prototype.getName = function() {
  return this._name;
};

Astronomy.Schema.prototype.getCollection = function() {
  return this._collection;
};

Astronomy.Schema.prototype.getInit = function() {
  return this._init;
};

Astronomy.Schema.prototype.getClass = function() {
  return this._class;
};


Astronomy.Schema.prototype.getParentClass = function() {
  return this._extend;
};
