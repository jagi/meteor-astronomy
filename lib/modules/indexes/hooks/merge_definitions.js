function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_.each(sourceDefinition.indexes, function(index, indexName) {
		targetDefinition.indexes[indexName] = index;
	});
};

export default onMergeDefinitions;