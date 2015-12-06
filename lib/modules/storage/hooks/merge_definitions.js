Astro.Module.modules.storage.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, ClassName
) {
  if (sourceDefinition.collection) {
    targetDefinition.collection = sourceDefinition.collection;
  }
  if (sourceDefinition.typeField) {
    targetDefinition.typeField = sourceDefinition.typeField;
  }
  if (sourceDefinition.transform !== undefined) {
    targetDefinition.transform = sourceDefinition.transform;
  }
};