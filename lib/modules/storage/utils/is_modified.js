Astro.utils.storage.isModified = function(options = {}) {
	let self = this;

	let {
		doc,
		pattern,
		transient = false,
		immutable = false
	} = options;

	let modified = self.getModified({ doc, transient, immutable });

	if (pattern) {
		return _.includes(modified, pattern);
	}
	else {
		return modified.length > 0;
	}
};