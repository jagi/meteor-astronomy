var classMethods = {};

classMethods.getIndexes = function() {
  return this.schema.indexes;
};

Astro.eventManager.on(
  'initClass', function onInitClassIndexes(schemaDefinition) {
    var Class = this;
    var Collection = Class.getCollection();

    // Add fields methods to the class.
    _.extend(Class, classMethods);

    // Add indexes to the collection
    _.each(Class.getIndexes(), function(indexDefinition, indexName) {
      Collection._ensureIndex(indexDefinition.fields, indexDefinition.options);
    });
  }
);
