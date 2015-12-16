Astro.utils.fields.setAll = function(doc, fieldsValues, options) {
  let Class = doc.constructor;

  // Get names of the fields that are not present in the fieldsValues variable.
  let fieldsNames = _.difference(Class.getFieldsNames(), _.keys(fieldsValues));

  _.each(fieldsNames, function(fieldName) {
    this.setOne(doc, fieldName, undefined, options);
  }, this);

  _.each(fieldsValues, function(fieldValue, fieldName) {
    this.setOne(doc, fieldName, fieldValue, options);
  }, this);
};
