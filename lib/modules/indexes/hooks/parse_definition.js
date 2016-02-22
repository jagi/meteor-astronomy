import throwParseError from '../../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence and validity of the "indexes" property.
	if (definition.indexes !== undefined) {
		_.each(definition.indexes, function(index, indexName) {
			if (!_.isObject(index)) {
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
			if (!_.has(index.options, 'name')) {
				index.options.name = indexName;
			}
			parsedDefinition.indexes[indexName] = index;
		});
	}

	// if (_.has(schemaDefinition, 'fields')) {
	//   _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
	//     if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'index')) {
	//       var indexDefinition;
	//
	//       if (
	//         fieldDefinition.index === -1 || fieldDefinition.index === 1 ||
	//         _.isString(fieldDefinition.index)
	//       ) {
	//         indexDefinition = {
	//           fields: {},
	//           options: {
	//             name: fieldName
	//           }
	//         };
	//         indexDefinition.fields[fieldName] = fieldDefinition.index;
	//       }
	//
	//       if (indexDefinition) {
	//         // Check validity of the event definition.
	//         checkDefinition(indexDefinition, fieldName, Class.getName());
	//         indexesDefinitions[fieldName] = indexDefinition;
	//       }
	//     }
	//   });
	// }
};

export default onParseDefinition;