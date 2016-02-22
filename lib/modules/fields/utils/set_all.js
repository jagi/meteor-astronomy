import setOne from './set_one.js';

function setAll(doc, fieldsValues, options) {
	let Class = doc.constructor;

	// Get names of the fields that are not present in the fieldsValues variable.
	let fieldsNames = _.difference(Class.getFieldsNames(), _.keys(fieldsValues));

	_.each(fieldsNames, (fieldName) => {
		setOne(doc, fieldName, undefined, options);
	});

	_.each(fieldsValues, (fieldValue, fieldName) => {
		setOne(doc, fieldName, fieldValue, options);
	});
};

export default setAll;