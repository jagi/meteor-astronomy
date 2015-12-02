let classStaticMethods = Astro.Module.modules.indexes.classStaticMethods;

classStaticMethods.hasIndex = function(indexName) {
  return _.has(this.schema.indexes, indexName);
};