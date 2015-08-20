var checks = {
};

var BaseClass = Astro.BaseClass;

var classMethods = {
  embedOne: function(fieldName, fieldDefinition) {
    var field = new Astro.EmbedOneField(fieldDefinition);

    // Add field definition to the schema.
    this.schema.fields[fieldName] = field;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  },

  embedMany: function(fieldName, fieldDefinition) {
    var field = new Astro.EmbedManyField(fieldDefinition);

    // Add field definition to the schema.
    this.schema.fields[fieldName] = field;

    // Add the field name to the list of all fields.
    this.schema.fieldsNames.push(fieldName);
  }
};


Astro.eventManager.on('initClass', function(definition) {
  var Class = this;

  _.extend(Class, classMethods);

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
