var classMethods = {};

classMethods.hasEvent = function(eventName, eventHandler) {
  var Class = this;

  return Class.schema.eventManager.has.apply(
    Class.schema.eventManager, arguments
  );
};

classMethods.emitEvent = function(event) {
  if (!Astro.config.triggerEvents) {
    return;
  }

  if (!event) {
    return;
  }

  var Class = this;
  var eventName = event.type;
  var target = event.target;

  Class.schema.eventManager.emit(event);

  if (!event.stopped) {
    return Astro.eventManager.emit(event);
  }

  return !event.stopped;
};

Astro.eventManager.on(
  'initClass', function onInitClassEvents(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    _.extend(Class, classMethods);

    // Add an event manger to the schema.
    schema.eventManager = schema.eventManager || Astro.Events.mixin({});
  }
);
