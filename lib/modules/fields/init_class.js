var classMethods = {};

classMethods.getFieldsNames = function() {
  return this.schema.fieldsNames;
};

classMethods.hasField = function(fieldName) {
  return _.has(this.schema.fields, fieldName);
};

classMethods.getField = function(fieldName) {
  return this.schema.fields[fieldName];
};

classMethods.getFields = function() {
  return this.schema.fields;
};

Astro.eventManager.on(
  'initClass', function onInitClassFields(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    // Add fields methods to the class.
    _.extend(Class, classMethods);

    schema.fields = schema.fields || {};
    schema.fieldsNames = schema.fieldsNames || [];
  }
);
