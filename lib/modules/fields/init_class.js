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

  fieldNameOrPattern: function(fieldNameOrPattern) {
    if (!_.isString(fieldNameOrPattern)) {
      throw new Error(
        'The field name or pattern in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }
  },

  exists: function(fieldNameOrPattern) {
    if (_.has(this.schema.fields, fieldNameOrPattern)) {
      throw new Error(
        'The "' + fieldNameOrPattern +
        '" field name or pattern had already been defined in the "' +
        this.getName() + '" class schema'
      );
    }
  }
};

var methods = {
  hasField: function(fieldNameOrPattern) {
    // Check if the field name had been provided and is a string.
    checks.fieldNameOrPattern.call(this, fieldNameOrPattern);

    return _.has(this.schema.fields, fieldNameOrPattern);
  },

  getField: function(fieldNameOrPattern) {
    // Check if the field name had been provided and is a string.
    checks.fieldNameOrPattern.call(this, fieldNameOrPattern);

    return this.schema.fields[fieldNameOrPattern];
  },

  getFields: function() {
    return this.schema.fields;
  },

  addField: function(fieldNameOrPattern, fieldDefinition) {
    // Check if the field name had been provided and is a string.
    checks.fieldNameOrPattern.call(this, fieldNameOrPattern);
    // Check if the field with the given name had already been defined.
    checks.exists.call(this, fieldNameOrPattern);

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
      !_.has(Astro.types, destFieldDefinition.type)
    ) {
      throw new Error(
        'The "' + destFieldDefinition.type +
        '" field type for "' + fieldNameOrPattern +
        '" field in the "' + this.getName() +
        '" class schema does not exist'
      );
    }

    // Add field definition to the schema.
    this.schema.fields[fieldNameOrPattern] = destFieldDefinition;

    // Add name to the appropriate group.
    if (Astro.utils.fields.isPattern(fieldNameOrPattern)) {
      this.schema.fieldsPatterns.push(fieldNameOrPattern);
    } else {
      this.schema.fieldsNames.push(fieldNameOrPattern);

      // If we don't support legacy browsers, then define getter and setter.
      if (!Astro.config.supportLegacyBrowsers) {
        Object.defineProperty(this.prototype, fieldNameOrPattern, {
          get: function() {
            return this.get(fieldNameOrPattern);
          },
          set: function(value) {
            this.set(fieldNameOrPattern, value);
          }
        });
      }
    }
  },

  addFields: function(fieldsNamesOrPatterns) {
    if (_.isArray(fieldsNamesOrPatterns)) {

      _.each(fieldsNamesOrPatterns, function(fieldNameOrPattern) {
        this.addField(fieldNameOrPattern);
      }, this);

    } else if (_.isObject(fieldsNamesOrPatterns)) {

      _.each(
        fieldsNamesOrPatterns,
        function(fieldDefinition, fieldNameOrPattern) {
          this.addField(
            fieldNameOrPattern,
            fieldsNamesOrPatterns[fieldNameOrPattern]
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

fieldsOnInitClass = function(schemaDefinition) {
  checks.schemaDefinition.call(this, schemaDefinition);

  var Class = this;

  // Add fields methods to the class.
  _.extend(Class, methods);

  // Add the "fields" attribute to the schema.
  Class.schema.fields = {};
  // Add the "fieldsNames" attribute to the schema.
  Class.schema.fieldsNames = [];
  // Add the "fieldsPatterns" attribute to the schema.
  Class.schema.fieldsPatterns = [];

  // Add the "_id" field only if documents of the given class are stored
  // directly in the collection.
  if (Class.getCollection()) {
    Class.addField('_id', {
      type: 'string',
      default: undefined
    });
  }

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
