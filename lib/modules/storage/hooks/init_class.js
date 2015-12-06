Astro.Module.modules.storage.onInitClass = function(
  Class, className
) {
  _.extend(Class, this.classStaticMethods);
};