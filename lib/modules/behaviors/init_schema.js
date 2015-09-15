var addBehavior = function(behaviorName, behaviorOptions) {
  var schema = this;

  // Get a behavior constructor.
  var classBehaviorGenerator = Astro.getBehavior(behaviorName);

  // Create instance of behavior and pass user options.
  schema.behaviors[behaviorName] = classBehaviorGenerator(behaviorOptions);
};

Astro.eventManager.on(
  'initSchema', function onInitSchemaBehavior(schemaDefinition) {
    var schema = this;

    // Add the "behaviors" attribute to the schema.
    schema.behaviors = schema.behaviors || {};

    if (_.has(schemaDefinition, 'behaviors')) {
      _.each(
        schemaDefinition.behaviors,
        function(behaviorOptions, behaviorName) {
          addBehavior.call(schema, behaviorName, behaviorOptions);
        }
      );
    }
  }
);
