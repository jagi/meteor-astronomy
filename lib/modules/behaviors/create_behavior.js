Astro.createBehavior = function(behaviorDefinition) {
  var behavior = new Astro.Behavior(behaviorDefinition);
  return Astro.behaviors[behavior.name] = behavior.createGenerator();
};
