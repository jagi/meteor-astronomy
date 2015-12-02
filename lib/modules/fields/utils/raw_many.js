Astro.utils.fields.rawMany = function(doc, fieldNames, options) {
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var fieldValue = this.rawOne(doc, fieldName, options);
    if (fieldValue !== undefined) {
      values[fieldName] = fieldValue;
    }
  }, this);

  return values;
};