let classStaticMethods = Astro.Module.modules.events.classStaticMethods;

classStaticMethods.hasEvent = function(eventName, eventHandler) {
  let Class = this;

  eventName = eventName.toLowerCase();

  if (arguments.length === 2) {
    return _.has(Class.schema.events[eventName], eventHandler);
  } else if (arguments.length === 1) {
    return _.has(Class.schema.events, eventName);
  }
};