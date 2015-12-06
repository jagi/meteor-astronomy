Astro.Module.modules.indexes.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, ClassName
) {
  _.each(sourceDefinition.indexes, function(index, indexName) {
    targetDefinition.indexes[indexName] = index;
  });
};