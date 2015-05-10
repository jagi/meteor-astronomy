eventsOnInitSchema = function(Class, definition) {
  if (_.has(definition, 'events')) {
    this.addEvents(definition.events);
  }
};
