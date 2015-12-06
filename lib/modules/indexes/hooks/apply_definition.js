Astro.Module.modules.indexes.onApplyDefinition = function(
  Class, definition, className
) {
  let Collection = Class.getCollection();
  if (!Collection) {
    return;
  }

  let schema = Class.schema;

  // Add indexes to the collection
  _.each(definition.indexes, function(index, indexName) {
    schema.indexes[indexName] = index;
    Collection._ensureIndex(index.fields, index.options);
  });
};