Astro.Module.modules.behaviors.onApplyDefinition = function(
	Class, parsedDefinition, className
) {
	var schema = Class.schema;

	// Add behaviors to the class.
	_.each(parsedDefinition.behaviors, function(behaviorsOptions, behaviorName) {
		// Get the behavior class.
		var Behavior = Astro.Behavior.get(behaviorName);
		_.each(behaviorsOptions, function(behaviorOptions) {
			// Create the behavior instance passing behavior options.
			var behavior = new Behavior(behaviorOptions);
			// Add behavior to the schema.
			schema.behaviors[behaviorName] = schema.behaviors[behaviorName] || [];
			schema.behaviors[behaviorName].push(behavior);
			// Extend class with the extend schema from the class behavior.
			Class.extend(behavior.createClassDefinition());
		});
	});
};