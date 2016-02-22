import ListField from '../list_field.js';

function getListFields() {
	return _.filter(this.getFields(), function(field) {
		return field instanceof ListField;
	});
};

export default getListFields;