var prototype = Astronomy.Schema.prototype;

prototype.addEvent = function(eventName, eventHandler) {
  // Check wheter event name is a string.
  if (!_.isString(eventName)) {
    throw new Error(
      'The event name in the "' + this.getName() + '" class schema has to be ' +
      'a string'
    );
  }

  // Check wheter event handler is a string.
  if (!_.isFunction(eventHandler)) {
    throw new Error(
      'The event handler in the "' + this.getName() + '" class schema has ' +
      'to be a function'
    );
  }

  this._eventManger.on(eventName, eventHandler);
};

prototype.addEvents = function(events) {
  if (!_.isObject(events)) {
    throw new Error(
      'The list of events in the "' + this.getName() + '" class schema has ' +
      'to be an object'
    );
  }

  for (var eventName in events) {
    this.addEvent(eventName, events[eventName]);
  }
};

prototype.hasEvent = function(eventName, eventHandler) {
  // Check if the event name is a string.
  if (!_.isString(eventName)) {
    throw new Error(
      'The event name in the "' + this.getName() + '" class schema has to be ' +
      'a string'
    );
  }

  // Check if any event with the given name exists.
  if (arguments.length === 1) {

    return this._eventManger.has(eventName);

    // When the event handler is provided.
  } else if (arguments.length === 2) {

    // First check if the event handler is a function.
    if (!_.isFunction(eventHandler)) {
      throw new Error(
        'The event handler in the "' + this.getName() + '" class schema has ' +
        'to be a function'
      );
    }

    // Check if given event handler exists.
    return this._eventManger.has(eventName, eventHandler);

  }
};

prototype.removeEvent = function(eventName, eventHandler) {
  // Check if the event name is a string.
  if (!_.isString(eventName)) {
    throw new Error(
      'The event name in the "' + this.getName() + '" class schema has to be ' +
      'a string'
    );
  }

  if (arguments.length === 1) {

    this._eventManger.remove(eventName);

    // When the event handler is provided.
  } else if (arguments.length === 2) {

    // First check if the event handler is a function.
    if (!_.isFunction(eventHandler)) {
      throw new Error(
        'The event handler in the "' + this.getName() + '" class schema has ' +
        'to be a function'
      );
    }

    this._eventManger.remove(eventName, eventHandler);

  }
};

prototype.triggerEvent = function(eventName, args, context) {
  var Class = this.getClass();

  var schemas;
  if (Class.schemas.length > 1) {
    schemas = Class.schemas.slice().reverse();
  } else {
    schemas = Class.schemas;
  }

  _.each(schemas, function(schema) {
    this._eventManger.every(eventName, function(eventHandler) {
      if (context) {
        eventHandler.apply(context, args);
      } else {
        eventHandler.apply(args);
      }
    });
  }, this);
};
