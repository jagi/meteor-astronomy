let methods = Astro.Module.modules.storage.meteorMethods;

methods.documentUpdate = function(doc) {
  return Astro.utils.storage.documentUpdate(doc);
};