var prototype = Astronomy.Schema.prototype;

prototype.addEvent = function(eventName, eventHandler) {
  if (!_.isString(eventName)) {
    return;
  }
  if (!_.isFunction(eventHandler)) {
    return;
  }

  this._events[eventName] = this._events[eventName] || [];

  // Interrupt adding event if it's already in the array.
  var index = _.indexOf(this._events[eventName], eventHandler);
  if (index !== -1) {
    return;
  }

  this._events[eventName].push(eventHandler);
};

prototype.addEvents = function(events) {
  if (!_.isObject(events)) {
    return;
  }

  for (var eventName in events) {
    this.addEvent(eventName, events[eventName]);
  }
};

prototype.removeEvent = function(eventName, eventHandler) {
  if (arguments.length === 1) {

    // Remove all event handlers for given event name.
    delete this._events[eventName];

  } else if (arguments.length === 2) {

    // Remove only one event handler (the passed one) from events list.
    var index = _.indexOf(this._events[eventName], eventHandler);
    if (index !== -1) {
      this._events[eventName].splice(index, 1);
    }

  }
};

prototype.triggerEvent = function(eventName, context, inherited) {
  inherited = inherited || false;
  var events = [];
  var schema = this;

  while (true) {
    // Get fields names for given (current or parent) schema.
    events.unshift.apply(events, schema._events[eventName] || []);

    if (inherited) {
      var ParentClass = schema.getParentClass();
      if (!ParentClass) {
        break;
      }
      schema = ParentClass.schema;

      // If `inherited` flag is set to false then stop getting events for parent
      // classes.
    } else {
      break;
    }
  }

  // Run events within the context if provided.
  _.each(events, function(eventHandler) {
    context ? eventHandler.call(context) : eventHandler();
  });
};
