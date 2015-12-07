let methods = Astro.Module.modules.storage.meteorMethods;

methods.documentInsert = function(doc) {
  return Astro.utils.storage.documentInsert(doc);
};