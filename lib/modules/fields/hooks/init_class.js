Astro.Module.modules.fields.onInitClass = function(
  Class, className
) {
  _.extend(Class, this.classStaticMethods);

  // Add events.
  Class.extend({
    events: this.classEvents
  });
};