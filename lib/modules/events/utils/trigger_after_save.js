Astro.utils.events.triggerAfterSave = function(doc, trusted) {
	// Trigger the "afterSave" event handlers.
	doc.dispatchEvent(new Astro.Event('afterSave', {
		propagates: true, trusted: trusted
	}));
};