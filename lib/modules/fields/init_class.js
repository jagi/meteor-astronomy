var fieldNameRegExp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

var checkAddField = function(fieldName, fieldDefinition) {
  // Field name has to be a string.
  if (!_.isString(fieldName)) {
    Astro.errors.throw('fields.field_name_is_string', this.getName());
  }
  // Check field validity.
  if (!fieldNameRegExp.test(fieldName)) {
    Astro.errors.throw('fields.field_name_not_allowed_characters', fieldName,
      this.geName());
  }
  // Check if the field already exists.
  if (_.has(this.schema.fields, fieldName)) {
    Astro.errors.throw('fields.already_defined', fieldName, this.getName());
  }
  // Check field definition.
  if (!_.isString(fieldDefinition) && !_.isObject(fieldDefinition) &&
    !_.isUndefined(fieldDefinition) && !_.isNull(fieldDefinition)
  ) {
    Astro.errors.throw('fields.field_definition', fieldName, this.getName());
  }
};

var checkAddFields = function(fieldsDefinitions) {
  // Fields definition has to be an object or an array.
  if (!_.isArray(fieldsDefinitions) && !_.isObject(fieldsDefinitions)) {
    Astro.errors.throw('fields.fields_definitions', this.getName());
  }
};

var methods = {};

methods.getFieldsNames = function() {
  return this.schema.fieldsNames;
};

methods.hasField = function(fieldName) {
  return _.has(this.schema.fields, fieldName);
};

methods.getField = function(fieldName) {
  return this.schema.fields[fieldName];
};

methods.getFields = function() {
  return this.schema.fields;
};

methods.addField = function(fieldName, fieldDefinition) {
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
};

methods.addFields = function(fieldsDefinitions) {
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
