import _ from 'lodash';

import ObjectField from '../ObjectField';

function getObjectFields() {
	return _.filter(this.getFields(), function(field) {
		return field instanceof ObjectField;
	});
};

export default getObjectFields;