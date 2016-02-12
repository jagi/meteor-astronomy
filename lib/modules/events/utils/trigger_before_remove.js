Astro.utils.events.triggerBeforeRemove = function(doc, trusted) {
	// Trigger the "beforeRemove" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeRemove'
		});
	}
};