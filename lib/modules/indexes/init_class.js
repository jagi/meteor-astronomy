var classMethods = {};

classMethods.hasIndex = function(indexName) {
  return _.has(this.schema.indexes, indexName);
};

classMethods.getIndex = function(indexName) {
  return this.schema.indexes[indexName];
};

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
