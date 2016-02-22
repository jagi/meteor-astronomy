import EventTarget from '../event_target.js';
// Class static methods.
import getEvents from '../class_static_methods/get_events.js';
import hasEvent from '../class_static_methods/has_event.js';

function onInitClass(Class, className) {
	EventTarget.mixin(Class);

	Class.getEvents = getEvents;
	Class.hasEvent = hasEvent;
};

export default onInitClass;