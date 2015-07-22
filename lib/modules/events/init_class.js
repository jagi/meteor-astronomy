var checks = {
  eventName: function(eventName) {
    if (!_.isString(eventName)) {
      throw new Error(
        'The event name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }
  },

  eventHandler: function(eventName, eventHandler) {
    if (!_.isFunction(eventHandler)) {
      throw new Error(
        'The event handler for the "' + eventName + '" event in the "' +
        this.getName() + '" class schema has to be a function'
      );
    }
  },

  events: function(events) {
    if (!_.isObject(events)) {
      throw new Error(
        'The list of events in the "' + this.getName() +
        '" class schema has to be an object'
      );
    }
  }
};

var methods = {
  addEvent: function(eventName, eventHandler) {
    // Check if event name is a string.
    checks.eventName.call(this, eventName);
    // Check if event handler is a function.
    checks.eventHandler.call(this, eventName, eventHandler);

    this.schema.on(eventName, eventHandler);
  },

  addEvents: function(events) {
    // Check if events definition.
    checks.events.call(this, events);

    _.each(events, function(eventHandler, eventName) {
      this.addEvent(eventName, eventHandler);
    }, this);
  },

  removeEvent: function(eventName, eventHandler) {
    // Check if event name is a string.
    checks.eventName.call(this, eventName);

    if (arguments.length === 1) {

      this.schema.off(eventName);

      // When the event handler is provided.
    } else if (arguments.length === 2) {

      // Check if event handler is a function.
      checks.eventHandler.call(this, eventName, eventHandler);

      this.schema.off(eventName, eventHandler);

    }
  },

  emitEvent: function(event) {
    if (!event) {
      return;
    }

    var Class = this;
    var eventName = event.type;
    var target = event.target;

    Astro.utils.class.everyClass(Class, function(Class) {
      if (Class.schema._events && _.has(Class.schema._events, eventName)) {
        return Class.schema.emit(event);
      } else {
        return true;
      }
    });

    if (!event.stopped) {
      return Astro.eventManager.emit(event);
    }

    return !event.stopped;
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add events from the schema definition.
  if (_.has(schemaDefinition, 'events')) {
    Class.addEvents(schemaDefinition.events);
  }
});
