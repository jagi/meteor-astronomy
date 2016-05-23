import _ from 'lodash';
import setDefaults from '../../fields/utils/set_defaults.js';
import castNested from '../../fields/utils/cast_nested.js';
import Event from '../../events/event.js';

function reload() {
	const doc = this;
	const Class = doc.constructor;

	// The document has to be already saved in the collection.
	if (!doc._isNew) {
		// Get a document from the collection without transformation.
		const rawDoc = Class.findOne(doc._id, {
			transform: null
		});

		// Trigger the "beforeInit" event handlers.
		doc.dispatchEvent(new Event('beforeInit'));

		// Set all fields.
		const fields = Class.getFields();
    _.each(fields, (field) => {
      doc[field.name] = field.resolveValue(rawDoc);
    });

    // Set default values if the "defaults" option is set.
    setDefaults({
      doc
    });
    // Cast nested documents.
    castNested({
      doc
    });

		// Trigger the "afterInit" event handlers.
		doc.dispatchEvent(new Event('afterInit'));

		// Mark the document as not new.
		doc._isNew = false;
	}
};

export default reload;