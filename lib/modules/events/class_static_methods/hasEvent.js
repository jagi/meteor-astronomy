import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';

function hasEvent(eventName, eventHandler) {
  const Class = this;

  eventName = eventName.toLowerCase();

  if (arguments.length === 2) {
    return includes(get(Class.schema.events, eventName), eventHandler);
  }
  else if (arguments.length === 1) {
    return has(Class.schema.events, eventName);
  }
}

export default hasEvent;