let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods._setAll = function(fieldsValues, options) {
  let doc = this;
  let Class = doc.constructor;

  // Get names of the fields that are not present in the fieldsValues variable.
  let fieldsNames = _.difference(Class.getFieldsNames(), _.keys(fieldsValues));

  _.each(fieldsNames, function(fieldName) {
    doc._setOne(fieldName, undefined, options);
  });

  _.each(fieldsValues, function(fieldValue, fieldName) {
    doc._setOne(fieldName, fieldValue, options);
  });
};
