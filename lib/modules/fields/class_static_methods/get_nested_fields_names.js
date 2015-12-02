let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getNestedFieldsNames = function() {
  return this.schema.nestedFieldsNames;
};