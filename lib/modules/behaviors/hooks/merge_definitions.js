Astro.Module.modules.behaviors.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, ClassName
) {
  _.each(sourceDefinition.behaviors, function(behaviorData, behaviorName) {
    targetDefinition.behaviors[behaviorName] = behaviorData;
  });
};