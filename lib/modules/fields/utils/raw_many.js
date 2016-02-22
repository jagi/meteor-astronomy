import rawOne from './raw_one.js';

function rawMany(doc, fieldNames, options) {
	let values = {};

	_.each(fieldNames, (fieldName) => {
		let fieldValue = rawOne(doc, fieldName, options);
		if (fieldValue !== undefined) {
			values[fieldName] = fieldValue;
		}
	});

	return values;
};

export default rawMany;