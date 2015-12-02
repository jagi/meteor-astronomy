let classStaticMethods = Astro.Module.modules.fields.classStaticMethods;

classStaticMethods.hasField = function(fieldName) {
  return _.has(this.schema.fields, fieldName) ||
    _.has(this.schema.nestedFields, fieldName);
};