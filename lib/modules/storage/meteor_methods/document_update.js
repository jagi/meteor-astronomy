let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/documentUpdate'] = function(doc) {
  return Astro.utils.storage.documentUpdate(doc);
};