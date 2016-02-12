Astro.utils.events.triggerBeforeUpdate = function(doc, trusted) {
	// Trigger the "beforeUpdate" event handlers.
	if (!doc.dispatchEvent(new Astro.Event('beforeUpdate', {
		cancelable: true, propagates: true, trusted: trusted
	}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeUpdate'
		});
	}
};