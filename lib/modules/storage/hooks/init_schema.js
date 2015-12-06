Astro.Module.modules.storage.onInitSchema = function(
  schema, className
) {
  schema.collection = null;
  schema.typeField = null;
  schema.transform = null;
};