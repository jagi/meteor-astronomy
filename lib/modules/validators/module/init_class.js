Astro.Module.modules.validators.onInitClass = function(
  Class, className
) {
  _.extend(Class, Astro.Module.modules.validators.classStaticMethods);
  _.extend(
    Class.prototype, Astro.Module.modules.validators.classPrototypeMethods
  );

  Class.extend({
    events: Astro.Module.modules.validators.classEvents
  });
};