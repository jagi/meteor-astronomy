let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/classRemove'] = function(className, selector) {
  return Astro.utils.storage.classRemove(className, selector);
};