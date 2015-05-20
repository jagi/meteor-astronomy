var checks = {};

checks.schemaDefinition = function(schemaDefinition) {
  // Check if fields definition is provided.
  if (!_.has(schemaDefinition, 'fields')) {
    throw new Error('The fields definition has to be provided');
  }

  // Check if the amount of fields is at least 1.
  if (_.size(schemaDefinition.fields) === 0) {
    throw new Error('At least one field has to be defined');
  }
};

checks.fieldName = function(fieldName) {
  if (!_.isString(fieldName)) {
    throw new Error(
      'The field name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.exists = function(fieldName) {
  if (_.has(this.schema.fields, fieldName)) {
    throw new Error(
      'The "' + fieldName + '" field had already been defined in the "' +
      this.getName() + '" class schema'
    );
  }
};

var methods = {};

methods.hasField = function(fieldName) {
  // Check if the field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);

  return _.has(this.schema.fields, fieldName);
};

methods.getField = function(fieldName) {
  // Check if the field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);

  return this.schema.fields[fieldName];
};

methods.getFields = function() {
  return this.schema.fields;
};

methods.addField = function(fieldName, fieldDefinition) {
  // Check if the field name had been provided and is a string.
  checks.fieldName.call(this, fieldName);
  // Check if the field with the given name had already been defined.
  checks.exists.call(this, fieldName);

  var destFieldDefinition = {
    type: null,
    default: null
  };

  if (_.isUndefined(fieldDefinition) || _.isNull(fieldDefinition)) {

    // If "fieldDefinition" is an "undefined" or "null" then take default
    // field's definition.

  } else if (_.isString(fieldDefinition)) {

    // If "fieldDefinition" is a "string" then set it as a type if given type
    // exists.
    destFieldDefinition.type = fieldDefinition;

  } else if (_.isObject(fieldDefinition)) {

    // If "fieldDefinition" is an "object" then pick the "type" and "default"
    // attributes.
    destFieldDefinition.type = fieldDefinition.type || null;
    if (!_.isUndefined(fieldDefinition.default)) {
      destFieldDefinition.default = fieldDefinition.default
    }

  } else {
    throw new Error(
      'The field definition in the "' + this.getName() +
      '" class schema has to be a string, an object or left empty'
    );
  }

  // Check whether given field type exists.
  if (
    destFieldDefinition.type !== null &&
    !_.has(Types, destFieldDefinition.type)
  ) {
    throw new Error(
      'The "' + destFieldDefinition.type + '" field type for "' + fieldName +
      '" field in the "' + this.getName() + '" class schema does not ' +
      'exist'
    );
  }

  // Add field definition to the schema.
  this.schema.fields[fieldName] = destFieldDefinition;

  // Define setter and getter for the field.
  Object.defineProperty(this.prototype, fieldName, {
    get: function() {
      return this.get(fieldName);
    },
    set: function(value) {
      this.set(fieldName, value);
    }
  });
};

methods.addFields = function(fields) {
  if (_.isArray(fields)) {

    _.each(fields, function(fieldName) {
      this.addField(fieldName);
    }, this);

  } else if (_.isObject(fields)) {

    _.each(fields, function(fieldDefinition, fieldName) {
      this.addField(fieldName, fields[fieldName]);
    }, this);

  } else {

    // Fields definition has to be an object or an array.
    throw new Error(
      'The fields definition in the "' + this.getName() +
      '" class schema has to be an array or an object'
    );

  }
};

fieldsOnInitClass = function(schemaDefinition) {
  checks.schemaDefinition.call(this, schemaDefinition);

  var Class = this;

  _.extend(Class, methods);

  // Add the "fields" attribute to the schema.
  Class.schema.fields = {};

  // Add mandatory "_id" field.
  Class.addField('_id', {
    type: 'string',
    default: undefined
  });

  // Add field for storing child class name.
  if (Class.getParent()) {
    Class.addField('_type', {
      type: 'string',
      default: Class.getName()
    });
  }

  // Add fields from the schema definition.
  Class.addFields(schemaDefinition.fields);
};
