function onApplyDefinition(Class, parsedDefinition, className) {
	if (!Meteor.isServer) {
		return;
	}

	let Collection = Class.getCollection();
	if (!Collection) {
		return;
	}

	let schema = Class.schema;

	// Add indexes to the collection
	_.each(parsedDefinition.indexes, function(index, indexName) {
		schema.indexes[indexName] = index;
		Collection._ensureIndex(index.fields, index.options);
	});
};

export default onApplyDefinition;