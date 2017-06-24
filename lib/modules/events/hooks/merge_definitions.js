import defaults from 'lodash/defaults';
import each from 'lodash/each';
import uniq from 'lodash/uniq';

function onMergeDefinitions(trgDefinition, srcDefinition, ClassName) {
  each(srcDefinition.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    // By default events list should be an empty array.
    defaults(trgDefinition.events, {
      [eventName]: []
    });
    // Add all events to the list.
    trgDefinition.events[eventName].push(...eventHandlers);
    // Make sure that there are no duplicates.
    trgDefinition.events[eventName] = uniq(trgDefinition.events[eventName]);
  });
};

export default onMergeDefinitions;