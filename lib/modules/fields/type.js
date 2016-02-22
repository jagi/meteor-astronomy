class Type {
	constructor(definition) {
		if (!Match.test(definition, {
				class: Function,
				validate: Match.Optional(Function),
				cast: Match.Optional(Function),
				raw: Match.Optional(Function)
			})) {
			throw new TypeError(
				'Invalid argument in the "Astro.Type.register" function'
			);
		}

		this.name = definition.class.name;
		this.class = definition.class;

		if (_.has(definition, 'validate')) {
			this.validate = definition.validate;
		}

		if (_.has(definition, 'cast')) {
			this.cast = definition.cast;
		}

		if (_.has(definition, 'raw')) {
			this.raw = definition.raw;
		}
	}

	validate(doc, fieldName) {
		return true;
	}

	static register(definition) {
		let type = new Type(definition);
		this.types[type.name] = type;
	}

	static get(typeName) {
		return this.types[typeName];
	}

	static getByClass(Type) {
		return this.get(Type.name);
	}

	static has(typeName) {
		return _.has(this.types, typeName);
	}

	static contains(Type) {
		return this.has(Type.name);
	}
};

Type.types = {};

export default Type;