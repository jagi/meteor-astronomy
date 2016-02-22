import Event from '../../events/event.js';

function triggerAfterUpdate(doc, trusted) {
	// Trigger the "afterUpdate" event handlers.
	doc.dispatchEvent(new Event('afterUpdate', {
		propagates: true,
		trusted: trusted
	}));
};

export default triggerAfterUpdate;