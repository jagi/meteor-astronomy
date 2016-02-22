import setOne from './set_one.js';

function setMany(doc, fieldsValues, options) {
	// Set multiple fields.
	_.each(fieldsValues, (setValue, fieldName) => {
		setOne(doc, fieldName, setValue, options);
	});
};

export default setMany;