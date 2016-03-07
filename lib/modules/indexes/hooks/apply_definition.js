import throwParseError from '../../../core/utils/throw_parse_error.js';

function onApplyDefinition(Class, parsedDefinition, className) {
  if (parsedDefinition.indexes !== undefined) {
    let Collection = Class.getCollection();

    if (!Meteor.isServer || (Collection && !Collection._connection)) {
  		return;
  	}

		if (!Collection && _.size(parsedDefinition.indexes) > 0) {
			throwParseError([{
					'class': className
				},
				'Can not add index to class without assigned collection'
			]);
		}

		let schema = Class.schema;

		// Add indexes to the collection
		_.each(parsedDefinition.indexes, function(index, indexName) {
			schema.indexes[indexName] = index;
			Collection._ensureIndex(index.fields, index.options);
		});
	}
};

export default onApplyDefinition;