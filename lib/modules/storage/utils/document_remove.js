Astro.utils.storage.documentRemove = function(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Remove only when document has the "_id" field (it's persisted).
	if (!doc._id) {
		return 0;
	}

	// Trigger the "beforeRemove" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeRemove'
		});
	}

	// Remove a document.
	let result = Collection._collection.remove({_id: doc._id});
	// Set document as a new, so it will be possible to save a document again.
	doc._isNew = true;

	// Trigger the "afterRemove" event handlers.
	doc.dispatchEvent(new Astro.Event('afterRemove', {
		propagates: true, trusted: trusted
	}));

	return result;
};