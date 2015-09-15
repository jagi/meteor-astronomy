Astro.Events = function() {};

_.extend(Astro.Events.prototype, {
  on: function(eventName, eventHandler) {
    this._events = this._events || {};
    eventName = eventName.toLowerCase();

    this._events[eventName] = this._events[eventName] || [];

    // Add event only if it's not already on the events list.
    if (!_.contains(this._events[eventName], eventHandler)) {
      this._events[eventName].push(eventHandler);
    }
  },

  off: function(eventName, eventHandler) {
    this._events = this._events || {};
    eventName = eventName.toLowerCase();

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
  },

  has: function(eventName, eventHandler) {
    this._events = this._events || {};
    eventName = eventName.toLowerCase();

    if (!_.has(this._events, eventName)) {
      return false;
    }

    return _.has(this._events[eventName], eventHandler);
  },

  emit: function(event) {
    this._events = this._events || {};
    var eventName = event.type;
    var target = event.target;
    eventName = eventName.toLowerCase();

    return _.every(this._events[eventName], function(eventHandler) {
      if (target) {
        eventHandler.call(target, event);
      } else {
        eventHandler(event);
      }
      return !event.stopped;
    });
  },

  each: function(eventName, callback, target) {
    this._events = this._events || {};
    eventName = eventName.toLowerCase();

    _.each(this._events[eventName], function(eventHandler) {
      if (target) {
        callback.call(target, eventHandler);
      } else {
        callback(eventHandler);
      }
    });
  },

  every: function(eventName, callback, target) {
    this._events = this._events || {};
    eventName = eventName.toLowerCase();

    _.every(this._events[eventName], function(eventHandler) {
      if (target) {
        return callback.call(target, eventHandler);
      } else {
        return callback(eventHandler);
      }
    });
  }
});

Astro.Events.mixin = function(obj) {
  if (_.isFunction(obj)) {
    _.each(Astro.Events.prototype, function(method, methodName) {
      obj.prototype[methodName] = method;
    });
  } else {
    _.each(Astro.Events.prototype, function(method, methodName) {
      obj[methodName] = method;
    });
  }
  return obj;
};
