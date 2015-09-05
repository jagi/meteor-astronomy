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

var checkFieldName = function(fieldName) {
  // Field name has to be a string.
  if (!_.isString(fieldName)) {
    throw new TypeError(
      'The field name in the "' + this.getName() + '" class has to be a string'
    );
  }
  // Check field validity.
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
    throw new Error(
      'The "' + fieldName + '" field name in the "' + this.geName() +
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
};

var checkType = function(type, fieldName) {
  if (!Astro.fields[type]) {
    throw new Error(
      'The type provided in the definition of the "' + fieldName +
      '" field in the "' + this.getName() + '" class does not exist'
    );
  }
};

methods.addField = function(fieldName, fieldDefinition) {
  checkFieldName.call(this, fieldName);

  var type;

  if (_.isUndefined(fieldDefinition) || _.isNull(fieldDefinition)) {

    type = 'null';
    fieldDefinition = {
      name: fieldName
    };

  } else if (_.isString(fieldDefinition)) {

    type = fieldDefinition;
    fieldDefinition = {
      name: fieldName,
      type: fieldDefinition
    };

  } else if (_.isObject(fieldDefinition)) {

    type = fieldDefinition.type;
    fieldDefinition = _.extend({}, fieldDefinition, {
      name: fieldName
    });

  }

  // Set a default type.
  type = _.isUndefined(type) ? 'null' : type;
  // Check wheter a given type exists.
  checkType.call(this, type, fieldName);
  // Get a field class from the type.
  var Field = Astro.fields[type];
  // Create a new field.
  var field = new Field(fieldDefinition);

  // Add field definition to the schema.
  this.schema.fields[fieldName] = field;
  // Add the field name to the list of all fields.
  this.schema.fieldsNames.push(fieldName);
};

var checkFieldsDefinitions = function(fieldsDefinitions) {
  // Fields definition has to be an object or an array.
  if (!_.isArray(fieldsDefinitions) && !_.isObject(fieldsDefinitions)) {
    throw new TypeError(
      'The list of fields in the "' + this.getName() +
      '" class has to be an array or an object'
    );
  }
};

methods.addFields = function(fieldsDefinitions) {
  checkFieldsDefinitions.call(this, fieldsDefinitions);

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
