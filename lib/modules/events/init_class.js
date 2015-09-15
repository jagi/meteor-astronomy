var classMethods = {};

classMethods.hasEvent = function(eventName, eventHandler) {
  var Class = this;

  return Class.schema.eventManager.has(eventName, eventHandler);
};

classMethods.emitEvent = function(event) {
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

    _.extend(Class, classMethods);
  }
);
