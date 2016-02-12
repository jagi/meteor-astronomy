Astro.utils.events.triggerBeforeInsert = function(doc, trusted) {
	// Trigger the "beforeInsert" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeInsert', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeInsert'
		});
	}
};