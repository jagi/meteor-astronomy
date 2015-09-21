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
    var className = schemaDefinition.name;

    if (_.has(schemaDefinition, 'behaviors')) {
      var behaviors = {};

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
          checkBehaviorData(behavior, behaviorName, className);
          behaviors[behaviorName] = behavior;
        }
      });

      schemaDefinition.behaviors = behaviors;
    }
  }
);
