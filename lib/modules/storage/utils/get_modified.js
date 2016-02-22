import rawAll from '../../fields/utils/raw_all.js';

function getModified(options = {}) {
	let {
		doc: newDoc,
		transient = false,
		immutable = false
	} = options;

	let Class = newDoc.constructor;
	let oldDoc = newDoc._id ? Class.findOne(newDoc._id) : new Class();

	let diff = function({
		newDoc,
		oldDoc,
		prefix = ''
	}) {
		let result = [];

		_.each(newDoc, function(newValue, fieldName) {
			let oldValue = oldDoc[fieldName];

			if (!EJSON.equals(oldValue, newValue)) {
				let nestedPrefix = (prefix && prefix + '.') + fieldName;
				result.push(nestedPrefix);

				// Compare two objects.
				if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {

					result.push(...diff({
						oldDoc: oldValue,
						newDoc: newValue,
						prefix: nestedPrefix
					}));

				}
				// Compare two arrays.
				else if (_.isArray(oldValue) && _.isArray(newValue)) {

					let maxLength = Math.max(oldValue.length, newValue.length);
					_.each(_.range(maxLength), function(index) {
						let arrayPrefix = nestedPrefix + '.' + index;
						let oldElement = oldValue[index];
						let newElement = newValue[index];
						if (!EJSON.equals(oldElement, newElement)) {
							result.push(arrayPrefix);
							// If both array elements are object, then we perform diff between
							// them.
							if (_.isPlainObject(oldElement) && _.isPlainObject(newElement)) {
								// Get a difference between elements.
								result.push(...diff({
									oldDoc: oldElement,
									newDoc: newElement,
									prefix: arrayPrefix
								}));
							}
						}
					});

				}
			}
		});

		return result;
	};

	return diff({
		// Get raw data from the docs.
		oldDoc: rawAll(oldDoc, {
			transient,
			immutable
		}),
		newDoc: rawAll(newDoc, {
			transient,
			immutable
		})
	});
};

export default getModified;