import _filter from 'lodash/filter';

import ObjectField from '../ObjectField';

function getObjectFields() {
	return _filter(this.getFields(), function(field) {
		return field instanceof ObjectField;
	});
};

export default getObjectFields;