import { default as AstroClass } from '../../core/class.js';

function returnFromDispatchEvent(event) {
	// If an event is cancelable and it had been canceled with the
	// "preventDefault" method call, then we return false.
	if (event.cancelable) {
		return !event.defaultPrevented;
	}
	return true;
};

class EventTarget {
	dispatchEvent(event) {
		if (!event) {
			throw new TypeError(
				'There is no event provided'
			);
		}

		let doc = this;
		let Class = doc.constructor;

		// Attach a document to the event as a target.
		if (event.target === null) {
			event.target = doc;
		}
		if (event.currentTarget === null) {
			event.currentTarget = doc;
		}

		// Get all event handlers of a given type.
		let eventHandlers = Class.getEvents(event.type);

		_.every(eventHandlers, function(eventHandler) {
			eventHandler(event);

			// Stop execution of the following event handlers, if a flag is set.
			return !event.immediatePropagationStopped;
		});

		// If propagation was stopped or bubbling is turned off, then we don't go
		// deeper into nested fields.
		if (event.propagationStopped || !event.propagates) {
			return returnFromDispatchEvent(event);
		}

		// Object fields.
		_.each(Class.getObjectFields(), function(field) {
			let value = doc[field.name];
			if (value instanceof AstroClass) {
				event.currentTarget = value;
				value.dispatchEvent(event);
			}
		});

		// List fields.
		_.each(Class.getListFields(), function(field) {
			let value = doc[field.name];
			if (field.class && _.isArray(value)) {
				_.each(value, function(element) {
					if (element instanceof AstroClass) {
						event.currentTarget = element;
						element.dispatchEvent(event);
					}
				});
			}
		});

		return returnFromDispatchEvent(event);
	}

	static mixin(target) {
		if (_.isFunction(target)) {
			_.each(EventTarget.prototype, function(method, methodName) {
				target.prototype[methodName] = method;
			});
		}
		else if (_.isObject(target)) {
			_.each(EventTarget.prototype, function(method, methodName) {
				target[methodName] = method;
			});
		}
		return target;
	}
};

export default EventTarget;