Astro.Module = class Module {
	constructor(definition) {
		if (!Match.test(definition, Object)) {
			throw new TypeError(
				'Module definition has to be an object'
			);
		}

		if (!Match.test(definition.name, String)) {
			throw new TypeError(
				'Module name has to be a string'
			);
		}

		// Set module name.
		this.name = definition.name;
	}

	onInitSchema(schema, className) {}
	onInitDefinition(definition, className) {}

	onInitClass(Class, className) {}

	onParseDefinition(definition, className) {}
	onApplyDefinition(Class, definition, className) {}
	onMergeDefinitions(targetDefinition, sourceDefinition, className) {}

	static create(definition) {
		let module = new this(definition);
		this.modules[module.name] = module;
		return module;
	}
};