Astro.Module.modules.events.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "events" property.
  parsedDefinition.events = {};
  _.each(definition.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    // Check if the event definition is an array of functions.
    if (!Match.test(eventHandlers, Match.OneOf(Function, [Function]))) {
      Astro.utils.core.throwParseError([
        {class: className}, {event: eventName},
        'The event handler has to be a function or an array of functions'
      ]);
    }

    // Convert function to array of functions.
    if (_.isFunction(eventHandlers)) {
      eventHandlers = [eventHandlers];
    }

    parsedDefinition.events[eventName] = eventHandlers;
  });

  return parsedDefinition;
};
