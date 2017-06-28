import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import _uniq from 'lodash/uniq';

function onApplyDefinition(Class, parsedDefinition, className) {
  const schema = Class.schema;

  // Add events to the event manager.
  _each(parsedDefinition.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    // By default events list should be an empty array.
    _defaults(schema.events, {
      [eventName]: []
    });
    // Add all events to the list.
    schema.events[eventName].push(...eventHandlers);
    // Make sure that there are no duplicates.
    schema.events[eventName] = _uniq(schema.events[eventName]);
  });
};

export default onApplyDefinition;