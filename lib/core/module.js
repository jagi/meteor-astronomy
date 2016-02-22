import throwParseError from './utils/throw_parse_error.js';

class Module {
	constructor(definition) {
		if (!Match.test(definition, Object)) {
			throwParseError([
				'Module definition has to be an object'
			]);
		}

		// Set module name.
		if (!Match.test(definition.name, String)) {
			throwParseError([
				'Module name has to be a string'
			]);
		}
		let moduleName = this.name = definition.name;

		// Set module hooks.
		_.each([
			'onInitSchema', 'onInitDefinition', 'onInitClass', 'onParseDefinition',
			'onApplyDefinition', 'onMergeDefinitions'
		], (hookName) => {
			if (definition[hookName] === undefined) {
				return;
			}
			if (!Match.test(definition[hookName], Function)) {
				throwParseError([{
						'module': moduleName
					}, {
						'property': hookName
					},
					`The "${hookName}" hook has to be a function`
				]);
			}
			this[hookName] = definition[hookName];
		});

		// Set module utils.
		if (definition.utils) {
			if (!Match.test(definition.utils, Object)) {
				throwParseError([{
						'module': moduleName
					}, {
						'property': 'utils'
					},
					'Utilities definition has to be an object'
				]);
			}
			this.utils = {};
			_.each(definition.utils, (method, methodName) => {
				if (!Match.test(method, Function)) {
					throwParseError([{
							'module': moduleName
						}, {
							'property': 'utils'
						}, {
							'method': methodName
						},
						'Utility has to be a function'
					]);
				}
				this.utils[methodName] = method;
			});
		}
	}

	onInitSchema(schema, className) {}
	onInitDefinition(definition, className) {}

	onInitClass(Class, className) {}

	onParseDefinition(parsedDefinition, definition, className) {}
	onApplyDefinition(Class, definition, className) {}
	onMergeDefinitions(targetDefinition, sourceDefinition, className) {}

	static create(definition) {
		let module = new this(definition);
		this.modules[module.name] = module;
		this.modulesOrder.push(module.name);
		return module;
	}

	static get(moduleName) {
		return this.modules[moduleName];
	}

	static forEach(iteratee) {
		if (!Match.test(iteratee, Function)) {
			throwParseError([
				'The first argument of the "Module.forEach" method has to be a function'
			]);
		}
		_.each(this.modulesOrder, (moduleName) => {
			iteratee(this.modules[moduleName]);
		});
	}
};

Module.modules = {};
Module.modulesOrder = [];

export default Module;