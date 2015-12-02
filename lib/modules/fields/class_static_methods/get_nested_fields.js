let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getNestedFields = function() {
  return this.schema.nestedFields;
};