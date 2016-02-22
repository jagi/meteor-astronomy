function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_.each(sourceDefinition.behaviors, function(behaviors, behaviorName) {
		targetDefinition.behaviors[behaviorName] =
			targetDefinition.behaviors[behaviorName] || [];
		targetDefinition.behaviors[behaviorName].push(...behaviors);
	});
};

export default onMergeDefinitions;