Astro.utils.storage.documentUpdate = function(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Return if there were no modifications.
	if (!doc.isModified()) {
		// 0 documents were modified.
		return 0;
	}

	// Trigger the "beforeSave" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeSave'
		});
	}
	// Trigger the "beforeUpdate" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeUpdate', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeUpdate'
		});
	}

	// Validate a document.
	Astro.utils.validators.documentValidate(doc);

	// Get modified values.
	let modified = Astro.utils.storage.getModified(doc);
	// Update a document.
	let result = Collection._collection.update(
		{ _id: doc._id }, { $set: modified }
	);

	// Trigger the "afterUpdate" event handlers.
	doc.dispatchEvent(new Astro.Event('afterUpdate', {
		propagates: true, trusted: trusted
	}));
	// Trigger the "afterSave" event handlers.
	doc.dispatchEvent(new Astro.Event('afterSave', {
		propagates: true, trusted: trusted
	}));

	return result;
};