eventsOnInitModule = function() {
  // Allow the global "Astronomy" object to store events.
  EventList.mixin(Astro);

  var prototype = Astro.Schema.prototype;

  prototype.addEvent = function(eventName, eventHandler) {
    // Check wheter event name is a string.
    if (!_.isString(eventName)) {
      throw new Error(
        'The event name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }

    // Check wheter event handler is a string.
    if (!_.isFunction(eventHandler)) {
      throw new Error(
        'The event handler in the "' + this.getName() +
        '" class schema has to be a function'
      );
    }

    this.on(eventName, eventHandler);
  };

  prototype.addEvents = function(events) {
    if (!_.isObject(events)) {
      throw new Error(
        'The list of events in the "' + this.getName() +
        '" class schema has to be an object'
      );
    }

    for (var eventName in events) {
      this.addEvent(eventName, events[eventName]);
    }
  };

  prototype.removeEvent = function(eventName, eventHandler) {
    // Check if the event name is a string.
    if (!_.isString(eventName)) {
      throw new Error(
        'The event name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }

    if (arguments.length === 1) {

      this.off(eventName);

      // When the event handler is provided.
    } else if (arguments.length === 2) {

      // First check if the event handler is a function.
      if (!_.isFunction(eventHandler)) {
        throw new Error(
          'The event handler in the "' + this.getName() +
          '" class schema has to be a function'
        );
      }

      this.off(eventName, eventHandler);

    }
  };
};
