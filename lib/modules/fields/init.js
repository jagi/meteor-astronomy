var prototype = Astro.Schema.prototype;

prototype.getField = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._fields[fieldName];
};

prototype.getFields = function() {
  return this._fields;
};

prototype.hasField = function(fieldName) {
  return _.has(this._fields, fieldName);
};

prototype.addField = function(fieldName, fieldDefinition) {
  // Check if field name had been provided and is a string.
  if (!_.isString(fieldName)) {
    throw new Error(
      'The field name in the "' + this.getName() + '" class schema has to be ' +
      'a string'
    );
  }

  if (_.isUndefined(fieldDefinition)) {

    // If "fieldDefinition" is an "undefined" then set "type" and "default" to null.
    fieldDefinition = {
      type: null,
      default: null
    };

  } else if (_.isString(fieldDefinition)) {

    // If "fieldDefinition" is a "string" then set it as a type if given type
    // exists.
    fieldDefinition = {
      type: fieldDefinition,
      default: null
    };

  } else if (_.isObject(fieldDefinition)) {

    // If "fieldDefinition" is an "object" then pick the "type" and "default"
    // attributes.
    fieldDefinition = {
      type: fieldDefinition.type || null,
      default: fieldDefinition.default || null
    };

  } else {
    throw new Error(
      'The field definition in the "' + this.getName() + '" class schema has ' +
      'to be a string, an object or left empty'
    );
  }

  // Check whether given field type exists.
  if (fieldDefinition.type !== null && !_.has(Types, fieldDefinition.type)) {
    throw new Error(
      'The "' + fieldDefinition.type + '" field type for "' + fieldName +
      '" field in the "' + this.getName() + '" class schema does not exist'
    );
  }

  // Add field definition to the schema.
  this._fields[fieldName] = fieldDefinition;

  // Define setter and getter for the field.
  Object.defineProperty(this.getClass().prototype, fieldName, {
    get: function() {
      return this.get(fieldName);
    },
    set: function(value) {
      this.set(fieldName, value);
    }
  });
};

prototype.addFields = function(fields) {
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
      'The fields definition in the "' + this.getName() + '" class schema ' +
      'has to be an array or an object'
    );

  }
};
