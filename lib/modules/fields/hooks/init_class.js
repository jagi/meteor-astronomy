Astro.Module.modules.fields.onInitClass = function(
  Class, className
) {
  // Add static methods to the class.
  _.extend(Class, this.classStaticMethods);

  // Add methods to the class prototype.
  _.extend(
    Class.prototype, Astro.Module.modules.fields.classPrototypeMethods
  );

  // Add events.
  Class.extend({
    events: this.classEvents
  });
};