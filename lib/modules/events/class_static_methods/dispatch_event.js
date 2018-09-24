import _every from 'lodash/every';
import Event from '../event';
import throwParseError from '../../core/utils/throw_parse_error';

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

  // Get all event handlers of a given type.
  const eventHandlers = Class.getEvents(event.type);

  // If there are no event of a fiven type, then just return true.
  if (eventHandlers.length === 0) {
    return true;
  }

  // Attach a document to the event as a target.
  if (event.target === null) {
    event.target = Class;
  }
  if (event.currentTarget === null) {
    event.currentTarget = Class;
  }

  _every(eventHandlers, (eventHandler) => {
    eventHandler(event);

    // Stop execution of the following event handlers, if a flag is set.
    return !event.immediatePropagationStopped;
  });

  return returnFromDispatchEvent(event);
}

export default dispatchEvent;