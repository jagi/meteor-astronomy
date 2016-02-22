import getOne from './get_one.js';

function getMany(doc, fieldNames, options) {
	let values = {};

	_.each(fieldNames, (fieldName) => {
		let fieldValue = getOne(doc, fieldName, options);
		if (fieldValue !== undefined) {
			values[fieldName] = fieldValue;
		}
	});

	return values;
};

export default getMany;