import {
  defaults,
  each,
  uniq
}
from 'lodash';

function onApplyDefinition(Class, parsedDefinition, className) {
  const schema = Class.schema;

  // Add events to the event manager.
  each(parsedDefinition.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    // By default events list should be an empty array.
    defaults(schema.events, {
      [eventName]: []
    });
    // Add all events to the list.
    schema.events[eventName].push(...eventHandlers);
    // Make sure that there are no duplicates.
    schema.events[eventName] = uniq(schema.events[eventName]);
  });
};

export default onApplyDefinition;