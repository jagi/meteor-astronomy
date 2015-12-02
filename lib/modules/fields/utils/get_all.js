Astro.utils.fields.getAll = function(doc, options) {
  var Class = doc.constructor;

  // Get list of fields and their values.
  return this.getMany(doc, Class.getFieldsNames(), options);
};
