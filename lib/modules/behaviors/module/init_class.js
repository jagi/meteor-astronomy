Astro.Module.modules.behaviors.onInitClass = function(
  Class, className
) {
  _.extend(Class, this.classStaticMethods);
};