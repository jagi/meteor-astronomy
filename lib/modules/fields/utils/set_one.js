import traverse from '../utils/traverse.js';
import warn from '../../../core/utils/warn.js';

function setOne(doc, fieldPattern, fieldValue) {
	return traverse(
		doc, fieldPattern,
		function(nestedDoc, nestedFieldName, field) {
			// If a field does not exist than we don't return anything.
			if (!field) {
				let Class = doc.constructor;
				warn(
					'["' + Class.getName() + '" class]["' + fieldPattern + '" field] ' +
					'Trying to set a value of the field that does not exist in the class'
				);
				return;
			}

			nestedDoc[nestedFieldName] = fieldValue;
		}
	);
};

export default setOne;