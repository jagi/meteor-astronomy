import _ from 'lodash';

import ScalarField from '../ScalarField';

function getScalarFields() {
	return _.filter(this.getFields(), function(field) {
		return field instanceof ScalarField;
	});
};

export default getScalarFields;