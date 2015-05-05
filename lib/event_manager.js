EventData = function(type, data) {
  this.type = type;
  this.data = data;
  this.stopped = false;
};

EventData.prototype.stopPropagation = function() {
  this.stopped = true;
};

EventManager = function() {
  this._events = {};
};

EventManager.prototype.on = function(eventName, eventHandler) {
  this._events[eventName] = this._events[eventName] || [];

  // Add event only if it's not already on the events list.
  if (!_.contains(this._events[eventName], eventHandler)) {
    this._events[eventName].push(eventHandler);
  }
};

EventManager.prototype.get = function(eventName) {
  if (arguments.length === 0) {
    return this._events;
  } else if (arguments.length === 1) {
    return this._events[eventName];
  }
};

EventManager.prototype.has = function(eventName, eventHandler) {
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

EventManager.prototype.remove = function(eventName, eventHandler) {
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

EventManager.prototype.emit = function(eventName, data) {
  var eventData = new EventData(eventName, data);

  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    return _.every(eventHandlers, function(eventHandler) {
      eventHandler(eventData);

      return !eventData.stopped;
    });
  }
};

EventManager.prototype.each = function(eventName, callback) {
  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    _.each(eventHandlers, function(eventHandler) {
      callback(eventHandler);
    });
  }
};

EventManager.prototype.every = function(eventName, callback) {
  var eventHandlers = this.get(eventName);
  if (eventHandlers) {
    return _.every(eventHandlers, function(eventHandler) {
      return callback(eventHandler);
    });
  }
};
