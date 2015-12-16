Astro.utils.fields.getMany = function(doc, fieldNames, options) {
  let values = {};

  _.each(fieldNames, function(fieldName) {
    let fieldValue = this.getOne(doc, fieldName, options);
    if (fieldValue !== undefined) {
      values[fieldName] = fieldValue;
    }
  }, this);

  return values;
};