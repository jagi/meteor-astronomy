let classStaticMethods = Astro.Module.modules.storage.classStaticMethods;

classStaticMethods.getTypeField = function() {
  return this.schema.typeField;
};