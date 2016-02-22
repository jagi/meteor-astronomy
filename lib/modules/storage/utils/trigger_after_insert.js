import Event from '../../events/event.js';

function triggerAfterInsert(doc, trusted) {
	// Trigger the "afterInsert" event handlers.
	doc.dispatchEvent(new Event('afterInsert', {
		propagates: true,
		trusted: trusted
	}));
};

export default triggerAfterInsert;