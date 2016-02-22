import AstroClass from '../../../core/class.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentUpdate from './document_update.js';
import applyModifier from './apply_modifier.js';

function classUpdate(className, selector, modifier, options, trusted = false) {
	// Throw exception if we are trying to perform an operation on more than one
	// document at once and it's not trusted call.
	if (!trusted) {
		throwIfSelectorIsNotId(selector, 'update');
	}

	let Class = AstroClass.get(className);
	let Collection = Class.getCollection();

	// Get all documents matching selector.
	let docs;
	if (options.multi) {
		docs = Class.find(selector);
	}
	else {
		docs = Class.find(selector, {
			limit: 1
		});
	}

	// Prepare result of the method execution.
	let result = 0;

	docs.forEach((doc) => {
		// Apply modifier.
		applyModifier({
			doc,
			modifier
		});

		// Update a document.
		result += documentUpdate(doc, trusted);
	});

	return result;
};

export default classUpdate;