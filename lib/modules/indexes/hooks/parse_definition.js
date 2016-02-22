import throwParseError from '../../../core/utils/throw_parse_error.js';

const fieldDefinitionPattern = Match.ObjectIncluding({
	index: Match.OneOf(1, -1, String)
});

const nameOptionPattern = Match.ObjectIncluding({
	name: String
});

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence and validity of the "indexes" property.
	if (definition.indexes !== undefined) {
		_.each(definition.indexes, (index, indexName) => {
			if (!Match.test(index, Object)) {
				throwParseError([{
						'class': className
					}, {
						'index': indexName
					},
					'Indexes definition has to be an object'
				]);
			}
			index = {
				fields: index.fields,
				options: index.options
			};
			if (!Match.test(index.options, nameOptionPattern)) {
				index.options.name = indexName;
			}
			parsedDefinition.indexes[indexName] = index;
		});
	}

	if (definition.fields !== undefined) {
		_.each(definition.fields, (fieldDefinition, fieldName) => {
			// Stop if a field definition does not contain index information.
			if (!Match.test(fieldDefinition, fieldDefinitionPattern)) {
				return;
			}
			// Prepare an index definition.
			let indexDefinition = {
				fields: {},
				options: {
					name: fieldName
				}
			};
			indexDefinition.fields[fieldName] = fieldDefinition.index;
			parsedDefinition.indexes[fieldName] = indexDefinition;
		});
	}
};

export default onParseDefinition;