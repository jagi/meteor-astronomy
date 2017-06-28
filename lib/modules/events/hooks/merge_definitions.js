import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import _uniq from 'lodash/uniq';

function onMergeDefinitions(trgDefinition, srcDefinition, ClassName) {
  _each(srcDefinition.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    // By default events list should be an empty array.
    _defaults(trgDefinition.events, {
      [eventName]: []
    });
    // Add all events to the list.
    trgDefinition.events[eventName].push(...eventHandlers);
    // Make sure that there are no duplicates.
    trgDefinition.events[eventName] = _uniq(trgDefinition.events[eventName]);
  });
};

export default onMergeDefinitions;