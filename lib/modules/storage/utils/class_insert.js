Astro.utils.storage.classInsert = function(className, plainDoc, trusted = false) {
	let Class = Astro.Class.get(className);
	let Collection = Class.getCollection();

	// Create a new document.
	let doc = new Class(plainDoc);

	// Insert a document.
	return this.documentInsert(doc, trusted);
};