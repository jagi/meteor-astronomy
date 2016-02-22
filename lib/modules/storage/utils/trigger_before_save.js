import Event from '../../events/event.js';

function triggerBeforeSave(doc, trusted) {
	// Trigger the "beforeSave" event handlers.
	if (!doc.dispatchEvent(new Event('beforeSave', {
			cancelable: true,
			propagates: true,
			trusted: trusted
		}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeSave'
		});
	}
};

export default triggerBeforeSave;