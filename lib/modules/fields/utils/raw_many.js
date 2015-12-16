Astro.utils.fields.rawMany = function(doc, fieldNames, options) {
  let values = {};

  _.each(fieldNames, function(fieldName) {
    let fieldValue = this.rawOne(doc, fieldName, options);
    if (fieldValue !== undefined) {
      values[fieldName] = fieldValue;
    }
  }, this);

  return values;
};