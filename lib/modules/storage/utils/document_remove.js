import triggerBeforeRemove from './trigger_before_remove.js';
import triggerAfterRemove from './trigger_after_remove.js';

function documentRemove(doc, trusted = false) {
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Remove only when document has the "_id" field (it's persisted).
	if (!doc._id) {
		return 0;
	}

	// Trigger before events.
	triggerBeforeRemove(doc, trusted);

	// Remove a document.
	let result = Collection._collection.remove({
		_id: doc._id
	});
	// Set document as a new, so it will be possible to save a document again.
	doc._isNew = true;

	// Trigger after events.
	triggerAfterRemove(doc, trusted);

	return result;
};

export default documentRemove;