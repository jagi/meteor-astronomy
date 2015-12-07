let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/documentInsert'] = function(doc) {
  return Astro.utils.storage.documentInsert(doc);
};