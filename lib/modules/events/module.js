Astronomy.Module({
  name: 'Events',
  initSchema: function(Class, definition) {
    this._events = {};

    if (_.has(definition, 'events')) {
      this.addEvents(definition.events);
    }
  }
});
