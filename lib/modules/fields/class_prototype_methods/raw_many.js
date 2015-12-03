let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods._rawMany = function(fieldNames, options) {
  let doc = this;
  let values = {};

  _.each(fieldNames, function(fieldName) {
    let fieldValue = doc._rawOne(fieldName, options);
    if (fieldValue !== undefined) {
      values[fieldName] = fieldValue;
    }
  });

  return values;
};