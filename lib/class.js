var extend = function(definition) {
  var Class = this;

  // Remove transform attribute if it's provided. We don't want to override
  // collection's already set transform function.
  delete definition.transform;

  definition.extend = Class;
  definition.collection = Class.schema.getCollection();

  return Astronomy.Class(definition);
};

var validateDefinition = function(definition) {
  // Check if class definition is provided.
  if (_.isUndefined(definition) || _.isNull(definition)) {
    throw new Error('Provide class definition');
  }
  // Check whether definition is object.
  if (!_.isObject(definition)) {
    throw new Error('Class definition has to be an object');
  }
  // Check if class name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('Provide class name');
  }
  // Check if class name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('Class name has to be a string');
  }
  // Check if a class with the given name already exists.
  if (_.has(Classes, definition.name)) {
    throw new Error('Class with the name `' + definition.name +
      '` is already defined');
  }
  // If collection is provided, then check its validity.
  if (_.has(definition, 'collection') &&
    !(definition.collection instanceof Mongo.Collection)) {
    throw new Error('Collection has to be an instance of `Mongo.Collection`');
  }
  // If class to extend from is provided, then check its validity. First, check
  // whether it's fuction. Later, if it has schema defined and finally check if
  // schema is instance of Astronomy.Schema.
  if (_.has(definition, 'extend') &&
    (!_.isFunction(definition.extend) ||
      !_.has(definition.extend, 'schema') ||
      !(definition.extend.schema instanceof Astronomy.Schema)
    )) {
    throw new Error('Class to extend from is not valid');
  }
  // If class constructor is provided, then check its validity.
  if (_.has(definition, 'init') && !_.isFunction(definition.init)) {
    throw new Error('Class constructor has to be function');
  }
};

Astronomy.Class = function(definition) {
  validateDefinition(definition);

  var Class = function Class() {
    if (!(this instanceof Class)) {
      throw new Error('Use `new` keyword to create instance');
    }

    // Call constructor.
    this.constructor.schema.getInit().apply(this, arguments);
  };

  // Add extend function to class object.
  Class.extend = extend;

  // Initialize schema and store it in the class object.
  Class.schema = new Astronomy.Schema(Class, definition);

  // Add given class to list of all defined classes. It's needed for
  // transformation of documents to particular subclass.
  Classes[definition.name] = Class;

  return Class;
};
