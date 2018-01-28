import _get from 'lodash/get';
import _has from 'lodash/has';
import _includes from 'lodash/includes';

function hasEvent(eventName, eventHandler) {
  const Class = this;

  eventName = eventName.toLowerCase();

  if (arguments.length === 2) {
    return _includes(_get(Class.schema.events, eventName), eventHandler);
  }
  else if (arguments.length === 1) {
    return _has(Class.schema.events, eventName);
  }
}

export default hasEvent;