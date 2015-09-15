var addEvent = function(eventName, eventHandler) {
  var schema = this;

  schema.eventManager.on(eventName, eventHandler);
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaEvents(schemaDefinition) {
    var schema = this;

    // Add an event manger to the schema.
    schema.eventManager = schema.eventManager || Astro.Events.mixin({});

    // Add events from the schema definition.
    if (_.has(schemaDefinition, 'events')) {
      _.each(schemaDefinition.events, function(eventHandlers, eventName) {
        _.each(eventHandlers, function(eventHandler) {
          addEvent.call(schema, eventName, eventHandler);
        });
      });
    }
  }
);
