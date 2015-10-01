var classMethods = {};

classMethods.getIndexes = function() {
  return this.schema.indexes;
};

Astro.eventManager.on(
  'initClass', function onInitClassIndexes(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    // Add fields methods to the class.
    _.extend(Class, classMethods);

    schema.indexes = schema.indexes || {};
  }
);
