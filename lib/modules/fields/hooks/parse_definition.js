import throwParseError from '../../../core/utils/throw_parse_error.js';
import Class from '../../../core/class.js';
import Type from '../type.js';

function parseFieldDefinition(definition, className) {
	// Check if the field name contains allowed characters.
	if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(definition.name)) {
		throwParseError([{
				'class': className
			}, {
				'property': 'fields'
			}, {
				'field': definition.name
			},
			'Name of field can only contain uppercase and lowercase letters, ' +
			'digits and underscore character'
		]);
	}
	// Check field type. It can be scalar type, class, list of scalar types or
	// list of classes.
	if (
		(
			Match.test(definition.type, Function) &&
			(!Type.contains(definition.type) &&
				!Class.contains(definition.type)
			)
		) ||
		(
			Match.test(definition.type, [Function]) &&
			(!Type.contains(definition.type[0]) &&
				!Class.contains(definition.type[0])
			)
		)
	) {
		throwParseError([{
				'class': className
			}, {
				'property': 'fields'
			}, {
				'field': definition.name
			},
			'Type of the field has to be scalar, class, list of scalars or list ' +
			'of classes'
		]);
	}
};

function onParseDefinition(parsedDefinition, definition, className) {
	if (definition.fields !== undefined) {
		// Fields definition has to be an object.
		if (!Match.test(definition.fields, Object)) {
			throwParseError([{
					'class': className
				}, {
					'property': 'fields'
				},
				'Fields definition has to be an object'
			]);
		}
		_.each(definition.fields, function(fieldDefinition, fieldName) {
			if (Match.test(fieldDefinition, Match.OneOf(Function, [Function]))) {
				fieldDefinition = {
					name: fieldName,
					type: fieldDefinition
				};
			}
			else if (Match.test(fieldDefinition, Object)) {
				fieldDefinition = _.extend(fieldDefinition, {
					name: fieldName
				});
			}
			else {
				throwParseError([{
						'class': className
					}, {
						'property': 'fields'
					}, {
						'field': fieldName
					},
					'Field definition has to be an object or type'
				]);
			}
			parseFieldDefinition(fieldDefinition, className);
			parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
		});
	}
};

export default onParseDefinition;