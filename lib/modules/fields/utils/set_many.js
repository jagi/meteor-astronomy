import _ from 'lodash';
import setOne from './set_one.js';

function setMany(doc, fieldsValues) {
	// Set multiple fields.
	_.forOwn(fieldsValues, (setValue, fieldName) => {
		setOne(doc, fieldName, setValue);
	});
};

export default setMany;