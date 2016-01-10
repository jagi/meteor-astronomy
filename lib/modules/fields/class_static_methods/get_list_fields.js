let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getListFields = function() {
  return _.filter(this.getFields(), function(field) {
    return field instanceof Astro.ListField;
  });
};