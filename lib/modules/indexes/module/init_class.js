Astro.Module.modules.indexes.onInitClass = function(
  Class, className
) {
  _.extend(Class, this.classStaticMethods);
};