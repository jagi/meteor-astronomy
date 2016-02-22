import Event from '../../events/event.js';

function triggerAfterRemove(doc, trusted) {
	// Trigger the "afterRemove" event handlers.
	doc.dispatchEvent(new Event('afterRemove', {
		propagates: true,
		trusted: trusted
	}));
};

export default triggerAfterRemove;