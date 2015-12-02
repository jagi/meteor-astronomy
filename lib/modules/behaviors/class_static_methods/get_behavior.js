let classStaticMethods = Astro.Module.modules.behaviors.classStaticMethods;

classStaticMethods.getBehavior = function(behaviorName) {
  return this.schema.behaviors[behaviorName];
};