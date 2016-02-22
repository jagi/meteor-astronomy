import traverse from '../utils/traverse.js';

function getOne(doc, fieldPattern, options) {
	// Prepare options.
	options = _.extend({
		transient: true,
		immutable: true
	}, options);

	return traverse(
		doc, fieldPattern,
		function(nestedDoc, nestedFieldName, field) {
			// If a field does not exist than we don't return anything.
			if (!field) {
				return;
			}

			// Don't get a transient field.
			if (!options.transient && field.transient) {
				return;
			}

			// Don't get an immutable field.
			if (!options.immutable && field.immutable) {
				return;
			}

			// Just return a value.
			return nestedDoc[nestedFieldName];
		}
	);
};

export default getOne;