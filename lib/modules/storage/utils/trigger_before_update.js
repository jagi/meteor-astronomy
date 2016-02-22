import Event from '../../events/event.js';

function triggerBeforeUpdate(doc, trusted) {
	// Trigger the "beforeUpdate" event handlers.
	if (!doc.dispatchEvent(new Event('beforeUpdate', {
			cancelable: true,
			propagates: true,
			trusted: trusted
		}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeUpdate'
		});
	}
};

export default triggerBeforeUpdate;