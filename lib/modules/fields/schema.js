var prototype = Astronomy.Schema.prototype;

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

  }

  // Add field definition to the schema.
  var Class = this._class;
  this._fields[fieldName] = fieldDefinition;

  // Define setter and getter for given field.
  Object.defineProperty(Class.prototype, fieldName, {
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
    for (var i = 0, length = fields.length; i < length; i++) {
      this.addField(fields[i]);
    }
  } else if (_.isObject(fields)) {
    for (var fieldName in fields) {
      this.addField(fieldName, fields[fieldName]);
    }
  }
};
