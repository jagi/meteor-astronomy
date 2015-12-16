Astro.utils.fields.rawAll = function(doc, options) {
  let Class = doc.constructor;

  // Get list of fields and their values.
  return this.rawMany(doc, Class.getFieldsNames(), options);
};