import Event from '../../events/event.js';

function triggerBeforeRemove(doc, trusted) {
	// Trigger the "beforeRemove" event handlers.
	if (!doc.dispatchEvent(new Event('beforeRemove', {
			cancelable: true,
			propagates: true,
			trusted: trusted
		}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeRemove'
		});
	}
};

export default triggerBeforeRemove;