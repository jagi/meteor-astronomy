let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods._setMany = function(fieldsValues, options) {
  let doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(setValue, fieldName) {
    doc._setOne(fieldName, setValue, options);
  });
};