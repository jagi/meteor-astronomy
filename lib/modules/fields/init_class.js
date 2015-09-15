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

Astro.eventManager.on(
  'initClass', function onInitClassFields(schemaDefinition) {
    var Class = this;

    // Add fields methods to the class.
    _.extend(Class, methods);
  }
);
