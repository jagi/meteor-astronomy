Astro.Utils = {};

Astro.Utils.emitSchemasEvent = function(schemas, eventName, e, context) {
  _.every(schemas, function(schema) {

    return schema._eventManager.every(eventName, function(eventHandler) {
      if (context) {
        eventHandler.call(context, e);
      } else {
        eventHandler(e);
      }
      return !e.stopped;
    });

  });
};
