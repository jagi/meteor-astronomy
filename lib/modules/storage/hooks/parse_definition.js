import throwParseError from '../../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence and validity of the "collection" property.
	if (definition.collection !== undefined) {
		// The "collection" property has to be an instance of the
		// "Mongo.Collection".
		if (!(definition.collection instanceof Mongo.Collection)) {
			throwParseError([{
					'class': className
				}, {
					'property': 'collection'
				},
				'Property value has to be an instance of "Mongo.Collection"'
			]);
		}
		parsedDefinition.collection = definition.collection;
	}

	// Check existence and validity of the "typeField" property.
	if (definition.typeField !== undefined) {
		// The "typeField" property has to be a string.
		if (!Match.test(definition.typeField, String)) {
			throwParseError([{
					'class': className
				}, {
					'property': 'typeField'
				},
				'Property value has to be a string'
			]);
		}
		parsedDefinition.typeField = definition.typeField;
	}

	// Check existence and validity of the "transform" property.
	if (definition.transform !== undefined) {
		// The "transform" property has to be a function.
		if (!Match.test(definition.transform, Match.OneOf(Function, null))) {
			throwParseError([{
					'class': className
				}, {
					'property': 'transform'
				},
				'Property value has to be a function or null'
			]);
		}
		parsedDefinition.transform = definition.transform;
	}
};

export default onParseDefinition;