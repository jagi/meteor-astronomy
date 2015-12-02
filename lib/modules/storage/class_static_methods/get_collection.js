let classStaticMethods = Astro.Module.modules.storage.classStaticMethods;

classStaticMethods.getCollection = function() {
  return this.schema.collection;
};