var fieldNameRegExp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

var checkAddField = function(fieldName, fieldDefinition) {
  // Field name has to be a string.
  if (!_.isString(fieldName)) {
    throw new Error(
      'The field name in the "' + this.getName() + '" class has to be a string'
    );
  }
  // Check field validity.
  if (!fieldNameRegExp.test(fieldName)) {
    throw new Error(
      'The "' + fieldName + '" field name in the "' + this.getName() +
      '" class contains not allowed characters'
    );
  }
  // Check if the field already exists.
  if (_.has(this.schema.fields, fieldName)) {
    throw new Error(
      'The "' + fieldName + '" field has already been defined in the "' +
      this.getName() + '" class'
    );
  }
  // Check field definition.
  if (!_.isString(fieldDefinition) && !_.isObject(fieldDefinition) &&
    !_.isUndefined(fieldDefinition) && !_.isNull(fieldDefinition)
  ) {
    throw new Error(
      'The definition of the "' + fieldName + '" field ' +
      'in the "' + this.getName() + '" class has to be ' +
      'a string, an object or left empty'
    );
  }
};

var checkAddFields = function(fieldsDefinitions) {
  // Fields definition has to be an object or an array.
  if (!_.isArray(fieldsDefinitions) && !_.isObject(fieldsDefinitions)) {
    throw new Error(
      'The list of fields in the "' + this.getName() +
      '" class has to be an array or an object'
    );
  }
};

var methods = {
  getFieldsNames: function() {
    return this.schema.fieldsNames;
  },

  hasField: function(fieldName) {
    return _.has(this.schema.fields, fieldName);
  },

  getField: function(fieldName) {
    return this.schema.fields[fieldName];
  },

  getFields: function() {
    return this.schema.fields;
  },

  addField: function(fieldName, fieldDefinition) {
    checkAddField.apply(this, arguments);

    if (_.isUndefined(fieldDefinition) || _.isNull(fieldDefinition)) {

      // If the "fieldDefinition" argument is an "undefined" or "null" then
      // create default a field's definition.
      fieldDefinition = new Astro.Field({
        name: fieldName
      });

    } else if (_.isString(fieldDefinition)) {

      // If the "fieldDefinition" argument is a "string" then set it as a type.
      fieldDefinition = new Astro.Field({
        name: fieldName,
        type: fieldDefinition
      });

    } else if (_.isObject(fieldDefinition)) {

      // If the "fieldDefinition" argument is an "object" then pass it to the
      // field's definition constructor.
      fieldDefinition.name = fieldName;
      fieldDefinition = new Astro.Field(fieldDefinition);

    }

    // Add field definition to the schema.
    this.schema.fields[fieldName] = fieldDefinition;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  },

  addFields: function(fieldsDefinitions) {
    checkAddFields.apply(this, arguments);

    var Class = this;

    if (_.isArray(fieldsDefinitions)) {

      _.each(fieldsDefinitions, function(fieldName) {
        Class.addField(fieldName);
      });

    } else if (_.isObject(fieldsDefinitions)) {

      _.each(fieldsDefinitions, function(fieldDefinition, fieldName) {
        Class.addField(fieldName, fieldsDefinitions[fieldName]);
      });

    }
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  // Add fields methods to the class.
  _.extend(Class, methods);

  // Add fields from the schema definition.
  if (_.has(schemaDefinition, 'fields')) {
    Class.addFields(schemaDefinition.fields);
  }
});
