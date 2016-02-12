Astro.utils.events.triggerAfterRemove = function(doc, trusted) {
	// Trigger the "afterRemove" event handlers.
	doc.dispatchEvent(new Astro.Event('afterRemove', {
		propagates: true, trusted: trusted
	}));
};