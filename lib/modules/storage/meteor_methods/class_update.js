let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/classUpdate'] = function(
  className, selector, modifier, options
) {
  return Astro.utils.storage.classUpdate(
    className, selector, modifier, options
  );
};