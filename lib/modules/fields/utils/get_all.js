Astro.utils.fields.getAll = function(doc, options) {
  let Class = doc.constructor;

  // Get list of fields and their values.
  return this.getMany(doc, Class.getFieldsNames(), options);
};
