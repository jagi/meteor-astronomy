Astro.Utils.EventManager = function() {
  this._events = {};
};

var prototype = Astro.Utils.EventManager.prototype;

prototype.on = function(eventName, eventHandler) {
  this._events[eventName] = this._events[eventName] || [];

  // Add event only if it's not already on the events list.
  if (!_.contains(this._events[eventName], eventHandler)) {
    this._events[eventName].push(eventHandler);
  }
};

prototype.get = function(eventName) {
  if (arguments.length === 0) {
    return this._events;
  } else if (arguments.length === 1) {
    return this._events[eventName];
  }
};

prototype.has = function(eventName, eventHandler) {
  // Check if any event with the name "eventName" exists.
  if (arguments.length === 1) {
    return _.has(this._events, eventName);
    // When "eventHandler" is provided.
  } else if (arguments.length === 2) {
    // Check if there is any event handler for given "eventName".
    if (!_.has(this._events, eventName)) {
      return false;
    }
    // Check if exact "eventHandler" exists.
    return _.contains(this._events[eventName], eventHandler);
  }
};

prototype.remove = function(eventName, eventHandler) {
  if (arguments.length === 1) {
    // Remove all event handlers for given event name.
    delete this._events[eventName];
  } else if (arguments.length === 2) {
    // Remove only one event handler (the passed one) from the events list.
    var index = _.indexOf(this._events[eventName], eventHandler);
    if (index >= 0) {
      this._events[eventName].splice(index, 1);
    }
  }
};

prototype.emit = function(eventName, data, context) {
  var eventData = new Astro.Utils.EventData(eventName, data);

  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    return _.every(eventHandlers, function(eventHandler) {
      if (context) {
        eventHandler.call(context, eventData);
      } else {
        eventHandler(eventData);
      }
      return !eventData.stopped;
    });
  }
};

prototype.each = function(eventName, callback, context) {
  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    _.each(eventHandlers, function(eventHandler) {
      if (context) {
        callback.call(context, eventHandler);
      } else {
        callback(eventHandler);
      }
    });
  }
};

prototype.every = function(eventName, callback, context) {
  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    return _.every(eventHandlers, function(eventHandler) {
      if (context) {
        callback.call(context, eventHandler);
      } else {
        return callback(eventHandler);
      }
    });
  }
};
