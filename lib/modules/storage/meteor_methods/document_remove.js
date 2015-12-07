let methods = Astro.Module.modules.storage.meteorMethods;

methods.documentRemove = function(doc) {
  return Astro.utils.storage.documentRemove(doc);
};