Astro.utils.storage.classUpdate = function(
	className, selector, modifier, options, trusted = false
) {
	let self = this;

	// Throw exception if we are trying to perform an operation on more than one
	// document at once and it's not trusted call.
	if (!trusted) {
		self.throwIfSelectorIsNotId(selector, 'update');
	}

	let Class = Astro.Class.get(className);
	let Collection = Class.getCollection();

	// Get all documents matching selector.
	let docs;
	if (options.multi) {
		docs = Class.find(selector);
	}
	else {
		docs = Class.find(selector, {limit: 1});
	}

	// Prepare result of the method execution.
	let result = 0;

	docs.forEach(function(doc) {
		// Apply modifier.
		Astro.utils.storage.applyModifier(doc, modifier);

		// Update a document.
		result += self.documentUpdate(doc, trusted);
	});

	return result;
};