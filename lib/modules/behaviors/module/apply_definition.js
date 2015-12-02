Astro.Module.modules.behaviors.onApplyDefinition = function(
  Class, definition, className
) {
  var schema = Class.schema;

  // Add behaviors to the class.
  _.each(definition.behaviors, function(behaviorOptions, behaviorName) {
    // Get the class behavior generator.
    var classBehaviorGenerator = Astro.Behavior.get(behaviorName);
    // Generate class behavior passing behavior options.
    var classBehavior = classBehaviorGenerator(behaviorOptions);
    // Add the class behavior to the schema.
    schema.behaviors[behaviorName] = classBehavior;
    // Extend class with the extend schema from the class behavior.
    Class.extend(classBehavior.definition);
  });
};
