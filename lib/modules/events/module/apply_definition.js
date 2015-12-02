Astro.Module.modules.events.onApplyDefinition = function(
  Class, parsedSchema, className
) {
  let schema = Class.schema;

  // Add events to the event manager.
  _.each(parsedSchema.events, function(eventHandlers, eventName) {
    eventName = eventName.toLowerCase();
    _.each(eventHandlers, function(eventHandler) {
      schema.events[eventName] = schema.events[eventName] || [];
      schema.events[eventName].push(eventHandler);
    });
  });
};
