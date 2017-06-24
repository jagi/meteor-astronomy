import filter from 'lodash/filter';

import ObjectField from '../ObjectField';

function getObjectFields() {
	return filter(this.getFields(), function(field) {
		return field instanceof ObjectField;
	});
};

export default getObjectFields;