Astro.utils.storage.documentUpdate = function(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Return if there were no modifications.
	if (!Astro.utils.storage.isModified({ doc })) {
		// 0 documents were modified.
		return 0;
	}

	// Trigger before events.
	Astro.utils.events.triggerBeforeSave(doc, trusted);
	Astro.utils.events.triggerBeforeUpdate(doc, trusted);

	// Validate a document.
	Astro.utils.validators.documentValidate(doc);

	// Update a document.
	let result = Collection._collection.update(
		{ _id: doc._id }, Astro.utils.storage.getModifier({ doc })
	);

	// Trigger after events.
	Astro.utils.events.triggerAfterUpdate(doc, trusted);
	Astro.utils.events.triggerAfterSave(doc, trusted);

	return result;
};