function getEvents(eventName) {
  let Class = this;

  if (eventName) {
    eventName = eventName.toLowerCase();
    return Class.schema.events[eventName] || [];
  }
  return Class.schema.events;
}

export default getEvents;