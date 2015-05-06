Astronomy.Module({
  name: 'Events',
  initSchema: function(Class, definition) {
    this._eventManager = new EventManager();

    if (_.has(definition, 'events')) {
      this.addEvents(definition.events);
    }
  }
});
