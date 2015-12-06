Astro.Module.modules.events.onInitClass = function(
  Class, className
) {
  _.extend(Class, this.classStaticMethods);
  _.extend(Class.prototype, this.classPrototypeMethods);
  Astro.EventTarget.mixin(Class);
};
