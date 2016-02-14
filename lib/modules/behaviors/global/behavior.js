const checkDefinition = function(definition) {
	// Check parameters validity.
	if (!Match.test(definition, Object)) {
		Astro.utils.core.throwParseError([
			'Behavior definition has to be an object'
		]);
	}

	// Check if behavior name is provided and is a string.
	if (!Match.test(definition.name, String)) {
		Astro.utils.core.throwParseError([
			'Behavior has to be named'
		]);
	}

	// Check if behavior with a given name already exists.
	if (_.has(Astro.Behavior.behaviors, definition.name)) {
		Astro.utils.core.throwParseError([{
				'behavior': definition.name
			},
			'Behavior already exists'
		]);
	}
};

Astro.Behavior = class Behavior {
	constructor(options) {
		let Behavior = this.constructor;
		this.options = _.extend({}, this.options, options);
	}

	createClassDefinition() {
		return {};
	}

	static create(definition) {
		checkDefinition(definition);

		// Get behavior name.
		let behaviorName = definition.name;
		// Extend the Astro.Behavior class.
		let Behavior = this.behaviors[behaviorName] = class Behavior extends this {};
		// Store definition in behavior class.
		Behavior.definition = definition;
		// Extend prototype with a definition.
		_.extend(Behavior.prototype, definition);

		return Behavior;
	}

	static get(behaviorName) {
		return this.behaviors[behaviorName];
	}

	static has(behaviorName) {
		return _.has(this.behaviors, behaviorName);
	}
};