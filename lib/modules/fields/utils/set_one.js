import traverse from '../utils/traverse.js';
import warn from '../../../core/utils/warn.js';
import removeUndefined from '../../../core/utils/remove_undefined.js';

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

			// If the document is new, don't allow the user to set properties
			// as undefined, as they will be turned into "null" values when inserted
			// into the DB. Then, since they're undefined on the model, and null in the db,
			// getModified() will return false positives.
			if (doc._isNew) {
				if (_.isPlainObject(fieldValue)) {
					nestedDoc[nestedFieldName] = removeUndefined(fieldValue);
				} else if (!_.isUndefined(fieldValue)) {
					nestedDoc[nestedFieldName] = fieldValue;
				}
			} else {
				nestedDoc[nestedFieldName] = fieldValue;
			}
		}
	);
};

export default setOne;