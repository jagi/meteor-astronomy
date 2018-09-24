import _filter from 'lodash/filter';

import ScalarField from '../ScalarField';

function getScalarFields() {
	return _filter(this.getFields(), function(field) {
		return field instanceof ScalarField;
	});
};

export default getScalarFields;