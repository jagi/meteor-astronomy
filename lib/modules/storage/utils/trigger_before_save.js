import Event from '../../events/event.js';

function triggerBeforeSave(doc, trusted, fields = []) {
	// Trigger the "beforeSave" event handlers.
	if (!doc.dispatchEvent(new Event('beforeSave', {
			cancelable: true,
			propagates: true,
			trusted: trusted,
			fields,
		}))) {
		// If an event was prevented, then we stop here.
		throw new Meteor.Error('prevented', 'Operation prevented', {
			eventName: 'beforeSave'
		});
	}
};

export default triggerBeforeSave;
