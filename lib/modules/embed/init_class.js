var fieldNameRegExp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

var checkEmbedOne = checkEmbedMany = function(fieldName, fieldDefinition) {
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
};

var methods = {
  embedOne: function(fieldName, fieldDefinition) {
    fieldDefinition.name = fieldName;
    var field = new Astro.EmbedOneField(fieldDefinition);

    // Add field definition to the schema.
    this.schema.fields[fieldName] = field;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  },

  embedMany: function(fieldName, fieldDefinition) {
    fieldDefinition.name = fieldName;
    var field = new Astro.EmbedManyField(fieldDefinition);

    // Add field definition to the schema.
    this.schema.fields[fieldName] = field;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  }
};

Astro.eventManager.on('initClass', function(definition) {
  var Class = this;

  _.extend(Class, methods);

  // Add embeded fields.
  if (_.has(definition, 'embedOne')) {
    _.each(definition.embedOne, function(fieldDefinition, fieldName) {
      Class.embedOne(fieldName, fieldDefinition);
    });
  }
  if (_.has(definition, 'embedMany')) {
    _.each(definition.embedMany, function(fieldDefinition, fieldName) {
      Class.embedMany(fieldName, fieldDefinition);
    });
  }
});
