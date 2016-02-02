Astro.utils.storage.documentInsert = function(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Prepare result of the method execution.
	let result;

	// Generate ID if not provided.
	if (!doc._id) {
		doc._id = Collection._makeNewID();
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
	// Trigger the "beforeInsert" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeInsert', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeInsert'
		});
	}

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
	result = doc._id;
	// Change the "_isNew" flag to "false". Now a document is not new.
	doc._isNew = false;

	// Trigger the "afterInsert" event handlers.
	doc.dispatchEvent(new Astro.Event('afterInsert', {
		propagates: true, trusted: trusted
	}));
	// Trigger the "afterSave" event handlers.
	doc.dispatchEvent(new Astro.Event('afterSave', {
		propagates: true, trusted: trusted
	}));

	return result;
};