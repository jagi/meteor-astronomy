Astro.utils.fields.setMany = function(doc, fieldsValues, options) {
  // Set multiple fields.
  _.each(fieldsValues, function(setValue, fieldName) {
    this.setOne(doc, fieldName, setValue, options);
  }, this);
};