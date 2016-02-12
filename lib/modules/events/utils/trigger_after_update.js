Astro.utils.events.triggerAfterUpdate = function(doc, trusted) {
	// Trigger the "afterUpdate" event handlers.
	doc.dispatchEvent(new Astro.Event('afterUpdate', {
		propagates: true, trusted: trusted
	}));
};