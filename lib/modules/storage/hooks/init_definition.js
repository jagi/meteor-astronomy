Astro.Module.modules.storage.onInitDefinition = function(
  definition, className
) {
  definition.collection = null;
  definition.typeField = null;
  definition.transform = undefined;
};