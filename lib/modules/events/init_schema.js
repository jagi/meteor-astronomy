eventsInitSchema = function(Class, definition) {
  // Create an event manager in the schema.
  this._eventManager = new Astro.Utils.EventManager();

  if (_.has(definition, 'events')) {
    this.addEvents(definition.events);
  }
};
