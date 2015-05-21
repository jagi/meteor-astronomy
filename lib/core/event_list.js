var on = function(eventName, eventHandler) {
  eventName = eventName.toLowerCase();

  this._events[eventName] = this._events[eventName] || [];

  // Add event only if it's not already on the events list.
  if (!_.contains(this._events[eventName], eventHandler)) {
    this._events[eventName].push(eventHandler);
  }
};

var off = function(eventName, eventHandler) {
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
};

EventList = {};

EventList.mixin = function(obj) {
  obj._events = {};
  obj.on = on;
  obj.off = off;
};
