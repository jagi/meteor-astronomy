let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getObjectFields = function() {
  return _.filter(this.getFields(), function(field) {
    return field instanceof Astro.ObjectField;
  });
};