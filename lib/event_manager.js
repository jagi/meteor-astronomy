EventManager = function() {};

var prototype = EventManager.prototype;

prototype.emit = function(eventName, eventData, target) {
  _.every(target.constructor.schemas, function(schema) {
    if (_.has(schema._events, eventName)) {
      return _.every(schema._events[eventName], function(eventHandler) {
        eventHandler.call(target, eventData);
        return !eventData.stopped;
      });
    } else {
      return true;
    }
  });

  if (!eventData.stopped) {
    if (_.has(Astro._events, eventName)) {
      _.every(Astro._events[eventName], function(eventHandler) {
        eventHandler.call(target, eventData);
        return !eventData.stopped;
      });
    }
  }

  return !eventData.stopped;
};

prototype.each = function(eventName, callback, target) {
  _.each(target.constructor.schemas, function(schema) {
    if (_.has(schema._events, eventName)) {
      _.each(schema._events[eventName], function(eventHandler) {
        callback.call(target, eventHandler);
      });
    }
  });

  if (_.has(Astro._events, eventName)) {
    _.each(Astro._events[eventName], function(eventHandler) {
      callback.call(target, eventHandler);
    });
  }
};

prototype.every = function(eventName, callback, target) {
  var all = _.every(target.constructor.schemas, function(schema) {
    if (_.has(schema._events, eventName)) {
      return _.every(schema._events[eventName], function(eventHandler) {
        return callback.call(target, eventHandler);
      });
    } else {
      return true;
    }
  });

  if (all) {
    if (_.has(Astro._events, eventName)) {
      all = _.every(Astro._events[eventName], function(eventHandler) {
        return callback.call(target, eventHandler);
      });
    }
  }

  return all;
};

Astro.eventManager = new EventManager();
