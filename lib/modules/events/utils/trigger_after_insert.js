Astro.utils.events.triggerAfterInsert = function(doc, trusted) {
	// Trigger the "afterInsert" event handlers.
	doc.dispatchEvent(new Astro.Event('afterInsert', {
		propagates: true, trusted: trusted
	}));
};