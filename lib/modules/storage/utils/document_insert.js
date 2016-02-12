Astro.utils.storage.documentInsert = function(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Generate ID if not provided.
	if (!doc._id) {
		doc._id = Collection._makeNewID();
	}

	// Trigger before events.
	Astro.utils.events.triggerBeforeSave(doc, trusted);
	Astro.utils.events.triggerBeforeInsert(doc, trusted);

	// Validate a document.
	Astro.utils.validators.documentValidate(doc);

	// Get plain values of all fields. Pick only values that we want to save.
	let values = Astro.utils.fields.rawAll(doc, {
		transient: false
	});
	// Insert a document.
	Collection._collection.insert(values);
	// There is a difference in what the insert method returns depending on the
	// environment. On the client it returns an inserted document id, on the
	// server it returns array of inserted documents. So we always return the
	// generated id. We can't send an entire document because it could be a
	// security issue if we are not subscribed to all fields of a document.
	let result = doc._id;
	// Change the "_isNew" flag to "false". Now a document is not new.
	doc._isNew = false;

	// Trigger after events.
	Astro.utils.events.triggerAfterInsert(doc, trusted);
	Astro.utils.events.triggerAfterSave(doc, trusted);

	return result;
};