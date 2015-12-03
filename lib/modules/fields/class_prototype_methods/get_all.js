let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods._getAll = function(options) {
  let doc = this;
  let Class = doc.constructor;

  // Get list of fields and their values.
  return doc._getMany(Class.getFieldsNames(), options);
};
