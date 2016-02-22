function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_.each(sourceDefinition.methods, function(method, methodName) {
		targetDefinition.methods[methodName] = method;
	});
};

export default onMergeDefinitions;