import Event from '../../events/event.js';

function triggerAfterSave(doc, trusted) {
	// Trigger the "afterSave" event handlers.
	doc.dispatchEvent(new Event('afterSave', {
		propagates: true,
		trusted: trusted
	}));
};

export default triggerAfterSave;