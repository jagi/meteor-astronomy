// Class static methods.
import dispatchEvent from '../class_static_methods/dispatch_event.js';
import getEvents from '../class_static_methods/get_events.js';
import hasEvent from '../class_static_methods/has_event.js';
// Class prototype methods.
import { default as dispatchEventProto } from '../class_prototype_methods/dispatch_event.js';

function onInitClass(Class, className) {
  // Class static methods.
  Class.dispatchEvent = dispatchEvent;
  Class.getEvents = getEvents;
  Class.hasEvent = hasEvent;
  // Class prototype methods.
  Class.prototype.dispatchEvent = dispatchEventProto;
}

export default onInitClass;