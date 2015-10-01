var checkBehaviorData = function(behaviorData, behaviorName, className) {
  if (!Match.test(behaviorData, Match.OneOf(Object, null, undefined))) {
    throw new Error(
      'The behavior data in the "' + className +
      '" class schema has to be an object or left empty'
    );
  }
  if (!Match.test(behaviorName, String)) {
    throw new Error(
      'The behavior name in the "' + className +
      '" class schema has to be a string'
    );
  }
  if (!_.has(Astro.behaviors, behaviorName)) {
    throw new Error(
      'The "' + behaviorName + '" behavior in "' + className +
      '" class schema does not exist'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionBehaviors(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;
    var behaviorsDefinitions = {};

    if (_.has(schemaDefinition, 'behaviors')) {
      _.each(schemaDefinition.behaviors, function(behaviorData, behaviorName) {
        var behavior;

        if (_.isObject(behaviorData)) {
          behavior = behaviorData;
        } else if (_.isString(behaviorData)) {
          behaviorName = behaviorData;
          behavior = {};
        }

        if (behavior) {
          // Check validity of the class behavior.
          checkBehaviorData(behavior, behaviorName, Class.getName());
          behaviorsDefinitions[behaviorName] = behavior;
        }
      });
    }

    if (_.size(behaviorsDefinitions) > 0) {
      _.each(behaviorsDefinitions, function(behaviorOptions, behaviorName) {
        // Get a behavior generator.
        var classBehaviorGenerator = Astro.getBehavior(behaviorName);
        var classBehavior = classBehaviorGenerator(behaviorOptions);
        behaviorsDefinitions[behaviorName] = classBehavior;
        Class.extend(classBehavior.definition);
      });

      // Add behaviors to the schema.
      _.extend(schema.behaviors, behaviorsDefinitions);
    }
  }
);
