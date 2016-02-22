import rawMany from './raw_many.js';

function rawAll(doc, options) {
	let Class = doc.constructor;

	// Get list of fields and their values.
	return rawMany(doc, Class.getFieldsNames(), options);
};

export default rawAll;