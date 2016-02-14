Astro.Module.modules.behaviors.onMergeDefinitions = function(
	targetDefinition, sourceDefinition, ClassName
) {
	_.each(sourceDefinition.behaviors, function(behaviors, behaviorName) {
		targetDefinition.behaviors[behaviorName] =
			targetDefinition.behaviors[behaviorName] || [];
		targetDefinition.behaviors[behaviorName].push(...behaviors);
	});
};