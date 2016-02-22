import ObjectField from '../object_field.js';

function getObjectFields() {
	return _.filter(this.getFields(), function(field) {
		return field instanceof ObjectField;
	});
};

export default getObjectFields;