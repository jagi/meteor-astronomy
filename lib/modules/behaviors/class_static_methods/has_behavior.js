let classStaticMethods = Astro.Module.modules.behaviors.classStaticMethods;

classStaticMethods.hasBehavior = function(behaviorName) {
  return _.has(this.schema.behaviors, behaviorName);
};