Astro.utils.storage.classRemove = function(
	className, selector, trusted = false
) {
	let self = this;

	// Throw exception if we are trying to perform an operation on more than one
	// document at once and it's not trusted call.
	if (!trusted) {
		self.throwIfSelectorIsNotId(selector, 'remove');
	}

	let Class = Astro.Class.get(className);
	let Collection = Class.getCollection();

	// Get all documents matching selector.
	let docs = Class.find(selector);

	// Prepare result of the method execution.
	let result = 0;

	docs.forEach(function(doc) {
		// Update a document.
		result += self.documentRemove(doc, trusted);
	});

	return result;
};