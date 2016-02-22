import Event from '../../events/event.js';

function reload() {
	let doc = this;
	let Class = doc.constructor;

	// The document has to be already saved in the collection.
	if (!doc._isNew) {
		// Get a document from the collection without transformation.
		let plainDoc = Class.findOne(doc._id, {
			transform: null
		});

		// Trigger the "beforeInit" event handlers.
		doc.dispatchEvent(new Event('beforeInit'));

		// Set all fields.
		let fields = Class.getFields();
		_.each(fields, function(field) {
			doc[field.name] = field.resolveValue(plainDoc);
		});

		// Trigger the "afterInit" event handlers.
		doc.dispatchEvent(new Event('afterInit'));

		// Mark the document as not new.
		doc._isNew = false;
	}
};

export default reload;