import Event from '../event.js';
import throwParseError from '../../../core/utils/throw_parse_error.js';

function returnFromDispatchEvent(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }
  return true;
}

function dispatchEvent(event) {
  const Class = this;

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
    event.target = Class;
  }
  if (event.currentTarget === null) {
    event.currentTarget = Class;
  }

  // Get all event handlers of a given type.
  const eventHandlers = Class.getEvents(event.type);

  _.every(eventHandlers, function(eventHandler) {
    eventHandler(event);

    // Stop execution of the following event handlers, if a flag is set.
    return !event.immediatePropagationStopped;
  });

  return returnFromDispatchEvent(event);
}

export default dispatchEvent;