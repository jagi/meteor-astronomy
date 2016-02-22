import AstroClass from '../../../core/class.js';
import traverse from './traverse.js';
import rawAll from './raw_all.js';

function rawOne(doc, fieldPattern, options) {
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

			// Get a value to be returned.
			let fieldValue = nestedDoc[nestedFieldName];

			if (fieldValue instanceof AstroClass) {
				return rawAll(fieldValue, options);
			}
			else if (_.isArray(fieldValue)) {
				return _.map(fieldValue, function(element) {
					if (element instanceof AstroClass) {
						return rawAll(element, options);
					}
					else {
						return element;
					}
				});
			}
			else {
				return fieldValue;
			}
		}
	);
};

export default rawOne;