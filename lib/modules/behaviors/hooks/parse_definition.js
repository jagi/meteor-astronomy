Astro.Module.modules.behaviors.onParseDefinition = function(
	definition, className
) {
	let parsedDefinition = {
		behaviors: {}
	};

	// Check existence of the "behaviors" property.
	if (!_.has(definition, 'behaviors')) {
		return parsedDefinition;
	}

	if (!Match.test(definition.behaviors, Match.OneOf([String], Object))) {
		Astro.utils.core.throwParseError([{
				'class': className
			}, {
				'property': 'behaviors'
			},
			'Behaviors definition has to be an array of behaviors\' names or an ' +
			'object with behaviors\' options'
		]);
	}

	_.each(definition.behaviors, function(behaviorOptions, behaviorName) {
		// If we deal with an array of behaviors' names, then behavior options is
		// an empty object.
		if (_.isString(behaviorOptions)) {
			behaviorName = behaviorOptions;
			behaviorOptions = [{}];
		}

		// Check if behavior with a given name exists.
		if (!Astro.Behavior.has(behaviorName)) {
			Astro.utils.core.throwParseError([{
					'class': className
				}, {
					'behavior': behaviorName
				},
				'Behavior does not exist'
			]);
		}

		// Behavior options has to be an object or an array of objects, when we are
		// adding multiple behaviors of the same type.
		if (!Match.test(behaviorOptions, Match.OneOf(Object, [Object]))) {
			Astro.utils.core.throwParseError([{
					'class': className
				}, {
					'behavior': behaviorName
				},
				'Behavior options have to be an object or an array of objects'
			]);
		}

		// Make sure that behavior options is an array of objects.
		if (!_.isArray(behaviorOptions)) {
			behaviorOptions = [behaviorOptions];
		}

		parsedDefinition.behaviors[behaviorName] = behaviorOptions;
	});

	return parsedDefinition;
};