EventManager = function() {};

var prototype = EventManager.prototype;

prototype.emit = function(eventName, eventData, target) {
  eventData = eventData || new Astro.EventData();

  if (target instanceof Astro.BaseClass) {
    Astro.utils.everyClass(target.constructor, function(Class) {
      if (_.has(Class.schema._events, eventName)) {
        return _.every(Class.schema._events[eventName], function(eventHandler) {
          eventHandler.call(target, eventData);
          return !eventData.stopped;
        });
      } else {
        return true;
      }
    });
  }

  if (!eventData.stopped) {
    if (_.has(Astro._events, eventName)) {
      _.every(Astro._events[eventName], function(eventHandler) {
        if (target) {
          eventHandler.call(target, eventData);
        } else {
          eventHandler(eventData);
        }
        return !eventData.stopped;
      });
    }
  }

  return !eventData.stopped;
};

prototype.each = function(eventName, callback, target) {
  if (target instanceof Astro.BaseClass) {
    Astro.utils.eachClass(target.constructor, function(Class) {
      if (_.has(Class.schema._events, eventName)) {
        _.each(Class.schema._events[eventName], function(eventHandler) {
          callback.call(target, eventHandler);
        });
      }
    });
  }

  if (_.has(Astro._events, eventName)) {
    _.each(Astro._events[eventName], function(eventHandler) {
      if (target) {
        callback.call(target, eventHandler);
      } else {
        callback(eventHandler);
      }
    });
  }
};

prototype.every = function(eventName, callback, target) {
  var all = true;

  if (target instanceof Astro.BaseClass) {
    all = Astro.utils.everyClass(target.constructor, function(Class) {
      if (_.has(Class.schema._events, eventName)) {
        return _.every(Class.schema._events[eventName], function(eventHandler) {
          return callback.call(target, eventHandler);
        });
      } else {
        return true;
      }
    });
  }

  if (all) {
    if (_.has(Astro._events, eventName)) {
      all = _.every(Astro._events[eventName], function(eventHandler) {
        if (target) {
          return callback.call(target, eventHandler);
        } else {
          return callback(eventHandler);
        }
      });
    }
  }

  return all;
};

Astro.eventManager = new EventManager();
