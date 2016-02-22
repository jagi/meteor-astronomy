import getMany from './get_many.js';

function getAll(doc, options) {
	let Class = doc.constructor;

	// Get list of fields and their values.
	return getMany(doc, Class.getFieldsNames(), options);
};

export default getAll;