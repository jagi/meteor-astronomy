import _ from 'lodash';

import ScalarField from '../scalar_field.js';

function getScalarFields() {
	return _.filter(this.getFields(), function(field) {
		return field instanceof ScalarField;
	});
};

export default getScalarFields;