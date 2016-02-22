import Type from '../type.js';
import AstroClass from '../../../core/class.js';
import ScalarField from '../scalar_field.js';
import ObjectField from '../object_field.js';
import ListField from '../list_field.js';
// Class events.
import fromJSONValue from '../class_events/from_json_value.js';
import toJSONValue from '../class_events/to_json_value.js';

function onApplyDefinition(Class, parsedDefinition, className) {
	_.each(parsedDefinition.fields, function(fieldDefinition, fieldName) {
		// Prepare field variable.
		let field;
		// Get type field.
		let type = fieldDefinition.type;
		// Scalar or object field.
		if (Match.test(type, Function)) {
			if (Type.contains(type)) {
				field = new ScalarField(
					_.extend({}, fieldDefinition, {
						type: Type.getByClass(type)
					})
				);
			}
			else if (AstroClass.contains(type)) {
				field = new ObjectField(
					_.extend({}, fieldDefinition, {
						type: null,
						class: type
					})
				);
			}
		}
		// List field.
		else if (Match.test(type, [Function])) {
			if (Type.contains(type[0])) {
				field = new ListField(
					_.extend({}, fieldDefinition, {
						type: Type.getByClass(type[0])
					})
				);
			}
			else if (AstroClass.contains(type[0])) {
				field = new ListField(
					_.extend({}, fieldDefinition, {
						type: null,
						class: type[0]
					})
				);
			}
		}

		// Add a field object to the fields list.
		Class.schema.fields[fieldName] = field;
		Class.schema.fieldsNames.push(fieldName);
	});

	// Class events.
	Class.extend({
		events: {
			fromJSONValue: fromJSONValue,
			toJSONValue: toJSONValue
		}
	}, ['events']);
};

export default onApplyDefinition;