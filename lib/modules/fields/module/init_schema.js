Astro.Module.modules.fields.onInitSchema = function(
  schema, className
) {
  schema.fields = {};
  schema.fieldsNames = [];
  schema.nestedFields = {};
  schema.nestedFieldsNames = [];
};