import _ from 'lodash';

function onApplyDefinition(Class, parsedDefinition, className) {
	const Collection = Class.getCollection();

	if (
		!Meteor.isServer ||
    !Collection ||
		(Collection && !Collection._connection)
	) {
		return;
	}

	const schema = Class.schema;

	function prefixIndexes(indexes, fieldName) {
		// Prefix the fields property.
		_.each(indexes, (index, indexName) => {
			index.fields = _.mapKeys(index.fields, (value, key) => {
				return `${fieldName}.${key}`;
			});
			_.extend(index.options, {
				name: `${fieldName}.${indexName}`
			});
		});
		// Prefix object keys.
		indexes = _.mapKeys(indexes, (index, indexName) => {
			return `${fieldName}.${indexName}`;
		});
		return indexes;
	}

	// Add indexes to the collection from nested classes.
	function collectNestedIndexes(Class) {
		const indexes = {};
		const fields = _.concat(
			Class.getObjectFields(), Class.getListFields(true)
		);
		_.each(fields, (field) => {
			_.extend(
				indexes,
				prefixIndexes(field.type.class.definition.indexes, field.name),
				prefixIndexes(collectNestedIndexes(field.type.class), field.name)
			);
		});
		return indexes;
	}

  const indexes = _.extend(
    {},
    parsedDefinition.indexes,
    collectNestedIndexes(Class)
  );

	_.each(indexes, (index, indexName) => {
		schema.indexes[indexName] = index;
		Collection._ensureIndex(index.fields, index.options);
	});
};

export default onApplyDefinition;