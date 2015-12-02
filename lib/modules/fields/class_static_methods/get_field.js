let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.getField = function(fieldName) {
  return this.schema.fields[fieldName] ||
    this.schema.nestedFields[fieldName];
};