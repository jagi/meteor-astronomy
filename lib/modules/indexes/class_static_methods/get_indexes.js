let classStaticMethods = Astro.Module.modules.indexes.classStaticMethods;

classStaticMethods.getIndexes = function() {
  return this.schema.indexes;
};