let classStaticMethods = Astro.Module.modules.indexes.classStaticMethods;

classStaticMethods.getIndex = function(indexName) {
  return this.schema.indexes[indexName];
};