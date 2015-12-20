Astro.Module.modules.behaviors.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "behaviors" property.
  parsedDefinition.behaviors = {};
  if (_.has(definition, 'behaviors')) {
    _.each(definition.behaviors, function(behaviorData, behaviorName) {
      if (_.isString(behaviorData)) {
        behaviorName = behaviorData;
        behaviorData = {};
      }

      // Check if the given behavior exists.
      if (!_.has(Astro.Behavior.behaviors, behaviorName)) {
        Astro.utils.core.throwParseError([
          {class: className}, {behavior: behaviorName},
          'The behavior does not exist'
        ]);
      }
      // Check if the behavior data is an object.
      if (!_.isObject(behaviorData)) {
        Astro.utils.core.throwParseError([
          {class: className}, {behavior: behaviorName},
          'The behavior data has to be an object'
        ]);
      }

      parsedDefinition.behaviors[behaviorName] = behaviorData;
    });
  }

  return parsedDefinition;
};