Astro.utils.fields.getMany = function(doc, fieldNames, options) {
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var fieldValue = this.getOne(doc, fieldName, options);
    if (fieldValue !== undefined) {
      values[fieldName] = fieldValue;
    }
  }, this);

  return values;
};