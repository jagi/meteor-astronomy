var checkAddEvent = function(eventName, eventHandler) {
  // Check if event name is a string.
  if (!_.isString(eventName)) {
    throw new Error(
      'The event name in the "' + this.getName() +
      '" class has to be a string'
    );
  }
  // Check if event handler is a function.
  if (!_.isFunction(eventHandler)) {
    throw new Error(
      'The event handler for the "' + eventName + '" event in the "' +
      this.getName() + '" class has to be a function'
    );
  }
};

var checkAddEvents = function(events) {
  if (!_.isObject(events)) {
    throw new Error(
      'The list of events in the "' + this.getName() +
      '" class has to be an object'
    );
  }
};

var methods = {
  hasEvent: function(eventName, eventHandler) {
    return this.schema.has(eventName, eventHandler);
  },

  addEvent: function(eventName, eventHandler) {
    checkAddEvent.apply(this, arguments);

    this.schema.on(eventName, eventHandler);
  },

  addEvents: function(events) {
    checkAddEvents.apply(this, arguments);

    _.each(events, function(eventHandler, eventName) {
      this.addEvent(eventName, eventHandler);
    }, this);
  },

  removeEvent: function(eventName, eventHandler) {
    if (arguments.length === 1) {

      this.schema.off(eventName);

      // When the event handler is provided.
    } else if (arguments.length === 2) {

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

    Class.schema.emit(event);

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
