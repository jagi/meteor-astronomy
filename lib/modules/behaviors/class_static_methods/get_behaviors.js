let classStaticMethods = Astro.Module.modules.behaviors.classStaticMethods;

classStaticMethods.getBehaviors = function() {
  return this.schema.behaviors;
};