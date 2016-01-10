let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getFields = function() {
  return _.values(this.schema.fields);
};