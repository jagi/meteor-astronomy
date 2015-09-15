var checkEventDefinition = function(eventDefinition, eventName, className) {
  // Check if the event name is a string.
  if (!Match.test(eventName, String)) {
    throw new Error(
      'The event name in the "' + className +
      '" class has to be a string'
    );
  }
  // Check if the event definition is an array of functions.
  if (!Match.test(eventDefinition, [Function])) {
    throw new Error(
      'The event handler for the "' + eventName + '" event in the "' +
      className + '" class has to be a function'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionEvents(schemaDefinition) {
    if (_.has(schemaDefinition, 'events')) {
      var eventsDefinitions = {};

      _.each(schemaDefinition.events, function(eventHandlers, eventName) {
        var eventDefinition;

        if (_.isArray(eventHandlers)) {
          eventDefinition = eventHandlers;
        } else if (_.isFunction(eventHandlers)) {
          eventDefinition = [eventHandlers];
        }

        if (eventDefinition) {
          // Check validity of the event definition.
          checkEventDefinition(
            eventDefinition, eventName, schemaDefinition.className
          );
          eventsDefinitions[eventName] = eventDefinition;
        }
      });

      schemaDefinition.events = eventsDefinitions;
    }
  }
);
