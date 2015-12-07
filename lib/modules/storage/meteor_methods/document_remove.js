let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/documentRemove'] = function(doc) {
  return Astro.utils.storage.documentRemove(doc);
};