var defaults = {
  validator: function () {
    return true;
  }
};

var initSchema = function (Cls, definition) {
  var self = this;

  // Check parameters validity.
  if (!_.isObject(definition)) throw new Error('Pass model definition');
  // Check if model name is provided.
  if (!_.has(definition, 'name')) throw new Error('Pass model name');
  // Check if model name is a string.
  if (!_.isString(definition.name)) throw new Error('Model name has to be string');
  // Check if model with given name already exists.
  if (_.has(Astronomy._classes, definition.name)) throw new Error('Model with name `' + definition.name + '` is already defined');

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Astronomy._classes[definition.name] = Cls;

  this._name = definition.name;
  this._class = Cls;
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
      this._collection._transform = LocalCollection.wrapTransform(Astronomy.transform(this._name));
    }
  }

  // Set class to extend from if defined.
  if (_.isFunction(definition.extend)) {
    this._extend = definition.extend;
  }

  // Set constructor for class.
  this._init = function () {
    // Create empty object per instance for storing object's values.
    this._values = {};
    // Create empty object per instance for storing object's modified values.
    this._modified = {};
    // By default constructor is extending `_values` object with first param.
    var attrs = arguments[0];
    if (_.isObject(attrs)) {
      _.extend(this._values, attrs);
    }
    // Call user constructor if defined.
    if (_.isFunction(definition.init)) {
      definition.init.apply(this, arguments);
    }
  };
};

Schema = function (Cls, definition) {
  // Initialize schema.
  initSchema.call(this, Cls, definition);

  // Extend.
  var Cls = this._class;
  var ParentClass = this.getParentClass();
  // Extend another model class if provided.
  if (ParentClass) {
    var Surrogate = function () {
      this.constructor = Cls;
    };
    Surrogate.prototype = ParentClass.prototype;
    Cls.prototype = new Surrogate;
    // Define field for storing child model name.
    definition.fields._type = this.getName();
  } else {
    // Create empty prototype object otherwise.
    Cls.prototype = {};
  }
  Cls.prototype.constructor = Cls;

  definition.fields._id = null;

  // Setup other options.
  if (definition.events) this.addEvents(definition.events);
  if (definition.fields) this.addFields(definition.fields);
  if (definition.methods) this.methods(definition.methods);
  if (definition.validators) this.validators(definition.validators);
  if (definition.behaviors) this.addBehaviors(definition.behaviors);
};

Schema.prototype.getName = function () {
  return this._name;
};

Schema.prototype.getCollection = function () {
  var schema = this;

  // Get collection from this schema or from parent classes' schema.
  while (!schema._collection) {
    var ParentClass = schema.getParentClass();
    if (!ParentClass) return;
    schema = ParentClass.schema;
  }

  return schema._collection;
};

Schema.prototype.init = function () {
  return this._init;
};

Schema.prototype.getParentClass = function () {
  return this._extend;
};

Schema.prototype.addEvent = function (eventName, eventHandler) {
  this._events[eventName] = this._events[eventName] || [];

  // Interrupt adding event if it's already in the array.
  var index = _.indexOf(this._events[eventName], eventHandler);
  if (index !== -1) return;

  this._events[eventName].push(eventHandler);
};

Schema.prototype.addEvents = function (events) {
  var self = this;

  if (!_.isObject(events)) return;

  _.each(events, function (eventHandler, eventName) {
    self.addEvent(eventName, eventHandler);
  });
};

Schema.prototype.removeEvent = function (eventName, eventHandler) {
  if (arguments.length === 1) {

    // Remove all event handlers for given event name.
    delete this._events[eventName];

  } else if (arguments.length === 2) {

    // Remove only one event handler (the passed one) from events list.
    var index = _.indexOf(this._events[eventName], eventHandler);
    if (index !== -1) {
      this._events[eventName].splice(index, 1);
    }

  }
};

Schema.prototype.triggerEvent = function (eventName, context, inherited) {
  inherited = inherited || false;
  var events = [];
  var schema = this;

  while (true) {
    // Get fields names for given (current or parent) schema.
    events.unshift.apply(events, schema._events[eventName] || []);

    if (inherited) {
      var ParentClass = schema.getParentClass();
      if (!ParentClass) break;
      schema = ParentClass.schema;

      // If `inherited` flag is set to false then stop getting events for parent
      // classes.
    } else {
      break;
    }
  }

  _.each(events, function (eventHandler) {
    context ? eventHandler.call(context) : eventHandler();
  });
};

Schema.prototype.getField = function (fieldName) {
  return this._fields[fieldName];
};

Schema.prototype.getFields = function () {
  return this._fields;
};

Schema.prototype.addField = function (fieldName, fieldValue) {
  var Cls = this._class;
  this._fields[fieldName] = fieldValue;
  Object.defineProperty(Cls.prototype, fieldName, {
    get: function () {
      return this.get(fieldName);
    },
    set: function (value) {
      this.set(fieldName, value);
    }
  });
};

Schema.prototype.addFields = function (fields) {
  if (_.isArray(fields)) {
    for (var i = 0, length = fields.length; i < length; i++) {
      this.addField(fields[i], null);
    }
  } else if (_.isObject(fields)) {
    for (var fieldName in fields) {
      this.addField(fieldName, fields[fieldName]);
    }
  }
};

Schema.prototype.field = function () {
  if (arguments.length === 1) {
    return this.getField.apply(this, arguments);
  } else if (arguments.length === 2) {
    this.addField.apply(this, arguments);
  }
};

Schema.prototype.fields = function () {
  if (arguments.length === 0) {
    return this.getFields.apply(this, arguments);
  } else if (arguments.length === 1) {
    this.addFields.apply(this, arguments);
  }
};

Schema.prototype.getFieldsNames = function (inherited) {
  inherited = inherited || false;
  var fields = [];
  var schema = this;

  while (true) {
    // Get fields names for given (current or parent) schema.
    fields = _.union(fields, _.keys(schema._fields));

    if (inherited) {
      var ParentClass = schema.getParentClass();
      if (!ParentClass) break;
      schema = ParentClass.schema;

      // If `inherited` flag is set to false then stop getting fields for parent classes.
    } else {
      break;
    }
  }

  return fields;
};

Schema.prototype.method = function (methodName, method) {
  if (!_.isFunction(method)) return;

  this._methods[methodName] = method;
  this._class.prototype[methodName] = method;
};

Schema.prototype.methods = function (methods) {
  var self = this;

  if (arguments.length === 0) {
    return self._methods;
  } else if (_.isObject(methods)) {
    _.each(methods, function (method, methodName) {
      self.method(methodName, method);
    });
  }
};

Schema.prototype.validator = function (context, validator) {
  if (arguments.length === 1 && _.isString(context)) {
    return this._validators[context];
  } else if (arguments.length === 2 && _.isString(context) && _.isFunction(
      validator)) {
    this._validators[context] = validator;
  }
};

Schema.prototype.validators = function (validators) {
  var self = this;

  if (arguments.length === 0) {
    return self._validators;
  } else if (_.isFunction(validators)) {
    self._validators.default = validators;
  } else if (_.isObject(validators)) {
    _.each(validators, function (validator, context) {
      self.validator(context, validator);
    });

    if (self._validators.default === undefined)
      self._validators.default = defaults.validator;
  }
};

Schema.prototype.addBehavior = function (behaviorName, behaviorOptions) {
  // Check if bahavior with given name exists.
  if (!_.has(Astronomy._behaviors, behaviorName)) throw new Error('Behavior with the name `' + behaviorName + '` is not defined');

  var behaviorDefinition = Astronomy._behaviors[behaviorName];

  this._behaviors[behaviorName] = behaviorOptions;

  if (behaviorDefinition.events) this.addEvents(behaviorDefinition.events);
  if (behaviorDefinition.fields) this.addFields(behaviorDefinition.fields);
  if (behaviorDefinition.methods) this.methods(behaviorDefinition.methods);
  if (behaviorDefinition.validators) this.validators(behaviorDefinition.validators);
};

Schema.prototype.addBehaviors = function (behaviors) {
  if (_.isArray(behaviors)) {
    for (var i = 0, length = behaviors.length; i < length; i++) {
      this.addBehavior(behaviors[i], {});
    }
  } else if (_.isObject(behaviors)) {
    for (var behaviorName in behaviors) {
      this.addBehavior(behaviorName, behaviors[behaviorName]);
    }
  }
};
