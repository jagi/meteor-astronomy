let returnFromDispatchEvent = function(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }
  return true;
};

Astro.EventTarget = class {
  dispatchEvent(event) {
    if (!event) {
      throw new TypeError(
        'There is no event provided'
      );
    }

    let doc = this;
    let Class = doc.constructor;

    // Attach a document to the event as a target.
    if (event.target === null) {
      event.target = doc;
    }
    if (event.currentTarget === null) {
      event.currentTarget = doc;
    }

    // Get all event handlers of a given type.
    let eventHandlers = Class.getEvents(event.type);

    _.every(eventHandlers, function(eventHandler) {
      eventHandler(event);

      // Stop execution of the following event handlers, if a flag is set.
      return !event.immediatePropagationStopped;
    });

    // If propagation was stopped or bubbling is turned off, then we don't go
    // deeper into nested fields.
    if (event.propagationStopped || !event.propagates) {
      return returnFromDispatchEvent(event);
    }

    let nestedFields = Class.getNestedFields();
    _.each(nestedFields, function(nestedField, nestedFieldName) {
      let nesteFieldValue = doc[nestedFieldName];
      if (
        nestedField.count === 'one' &&
        nesteFieldValue instanceof Astro.Class
      ) {
        event.currentTarget = nesteFieldValue;
        nesteFieldValue.dispatchEvent(event);
      } else if (
        nestedField.count === 'many' &&
        nestedField.class && _.isArray(nesteFieldValue)
      ) {
        _.each(nesteFieldValue, function(element) {
          if (element instanceof Astro.Class) {
            event.currentTarget = element;
            element.dispatchEvent(event);
          }
        });
      }
    });

    return returnFromDispatchEvent(event);
  }

  static mixin(target) {
    if (_.isFunction(target)) {
      _.each(Astro.EventTarget.prototype, function(method, methodName) {
        target.prototype[methodName] = method;
      });
    } else if (_.isObject(target)) {
      _.each(Astro.EventTarget.prototype, function(method, methodName) {
        target[methodName] = method;
      });
    }
    return target;
  }
};