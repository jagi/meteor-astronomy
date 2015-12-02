let classStaticMethods = Astro.Module.modules.events.classStaticMethods;

classStaticMethods.getEvents = function(eventName) {
  let Class = this;

  if (eventName) {
    eventName = eventName.toLowerCase();
    return Class.schema.events[eventName] || [];
  }
  return Class.schema.events;
};