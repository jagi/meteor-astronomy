import AstroClass from '../../../core/class.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentUpdate from './document_update.js';
import applyModifier from './apply_modifier.js';
import { Minimongo } from 'meteor/minimongo';

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

	// Create a minimongo matcher object to find array indexes on the projection
	// operator use.
	let matcher = new Minimongo.Matcher(selector);

	// Prepare result of the method execution.
	let result = 0;

	docs.forEach((doc) => {
		// Use matcher to find array indexes in a given document that needs updating
		// on the projection operator use.
		let queryResult = matcher.documentMatches(doc);
		let options = {};
		if (queryResult.arrayIndices) {
			options.arrayIndices = queryResult.arrayIndices;
		}

		// Apply modifier.
		applyModifier({
			doc,
			modifier,
			options
		});

		// Update a document.
		result += documentUpdate(doc, trusted);
	});

	return result;
};

export default classUpdate;