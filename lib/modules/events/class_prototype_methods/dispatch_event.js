import Event from '../event.js';
import throwParseError from '../../../core/utils/throw_parse_error.js';
import { default as AstroClass } from '../../../core/class.js';

function returnFromDispatchEvent(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }
  return true;
}

function dispatchEvent(event) {
  const doc = this;
  const Class = doc.constructor;

  if (!Match.test(event, Event)) {
    throwParseError([{
        'class': Class.getName()
      }, {
        'method': 'dispatchEvent'
      },
      'The first argument has to be an event object'
    ]);
  }

  // Attach a document to the event as a target.
  if (event.target === null) {
    event.target = doc;
  }
  if (event.currentTarget === null) {
    event.currentTarget = doc;
  }

  // Get all event handlers of a given type.
  const eventHandlers = Class.getEvents(event.type);

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
    if (field.isClass && _.isArray(value)) {
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

export default dispatchEvent;