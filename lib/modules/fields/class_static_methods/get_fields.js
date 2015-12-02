let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getFields = function() {
  return _.extend({}, this.schema.fields, this.schema.nestedFields);
};