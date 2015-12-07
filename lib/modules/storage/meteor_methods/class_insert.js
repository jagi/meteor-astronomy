let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/classInsert'] = function(className, values) {
  return Astro.utils.storage.classInsert(className, values);
};