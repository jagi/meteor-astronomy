let classStaticMethods = Astro.Module.modules.storage.classStaticMethods;

classStaticMethods.getTransform = function() {
  return this.schema.transform;
};