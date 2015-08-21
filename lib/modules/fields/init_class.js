var fieldNameRegExp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

var checks = {
  schemaDefinition: function(schemaDefinition) {
    // Check if fields definition is provided.
    if (!_.has(schemaDefinition, 'fields')) {
      throw new Error('The fields definition has to be provided');
    }

    // Check if the amount of fields is at least 1.
    if (_.size(schemaDefinition.fields) === 0 && !this.getParent()) {
      throw new Error('At least one field has to be defined');
    }
  },

  fieldName: function(fieldName) {
    if (!_.isString(fieldName)) {
      throw new Error(
        'The field name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }

    if (!fieldNameRegExp.test(fieldName)) {
      throw new Error(
        'The "' + fieldName + '" field name in the "' + this.getName() +
        '" class schema contains not allowed characters'
      );
    }
  },

  exists: function(fieldName) {
    if (_.has(this.schema.fields, fieldName)) {
      throw new Error(
        'The "' + fieldName +
        '" field name or pattern had already been defined in the "' +
        this.getName() + '" class schema'
      );
    }
  }
};

var fieldsClassMethods = {
  getFieldsNames: function() {
    return this.schema.fieldsNames;
  },

  hasField: function(fieldName) {
    // Check if the field name had been provided and is a string.
    checks.fieldName.call(this, fieldName);

    return _.has(this.schema.fields, fieldName);
  },

  getField: function(fieldName) {
    // Check if the field name had been provided and is a string.
    checks.fieldName.call(this, fieldName);

    return this.schema.fields[fieldName];
  },

  getFields: function() {
    return this.schema.fields;
  },

  addField: function(fieldName, fieldDefinition) {
    // Check if the field name had been provided and is a string.
    checks.fieldName.call(this, fieldName);
    // Check if the field with the given name had already been defined.
    checks.exists.call(this, fieldName);

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

    } else {
      throw new Error(
        'The definition of the "' + fieldName + '" field ' +
        'in the schema of the "' + this.getName() + '" class has to be ' +
        'a string, an object or left empty'
      );
    }

    // Add field definition to the schema.
    this.schema.fields[fieldName] = fieldDefinition;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  },

  addFields: function(fieldsDefinitions) {
    if (_.isArray(fieldsDefinitions)) {

      _.each(fieldsDefinitions, function(fieldName) {
        this.addField(fieldName);
      }, this);

    } else if (_.isObject(fieldsDefinitions)) {

      _.each(
        fieldsDefinitions,
        function(fieldDefinition, fieldName) {
          this.addField(
            fieldName,
            fieldsDefinitions[fieldName]
          );
        },
        this
      );

    } else {

      // Fields definition has to be an object or an array.
      throw new Error(
        'The fields definition in the "' + this.getName() +
        '" class schema has to be an array or an object'
      );

    }
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  checks.schemaDefinition.call(this, schemaDefinition);

  var Class = this;

  // Add fields methods to the class.
  _.extend(Class, fieldsClassMethods);

  // Add the "fields" attribute to the schema.
  Class.schema.fields = {};
  // Add the "fieldsNames" attribute to the schema.
  Class.schema.fieldsNames = [];

  // Add fields from the schema definition.
  Class.addFields(schemaDefinition.fields);
});
