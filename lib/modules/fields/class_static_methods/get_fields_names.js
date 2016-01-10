let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getFieldsNames = function() {
  return this.schema.fieldsNames;
};