Astro.ListField = class ListField extends Astro.Field {
	constructor(definition) {
		super(definition);

		this.type = definition.type === undefined || definition.type === null ?
			null : definition.type;
		this.class = definition.class === undefined ?
			null : definition.class;
	}

	validate(args) {
		super(args);
		var { doc, name, value } = args;

		if (value !== null && value !== undefined) {
			Validators.array(args);

			if (this.class) {
				_.each(value, (element, index) => {
					Validators.class({ doc, name, value: element, param: this.class });
				});
			}
			else if (this.type) {
				_.each(value, (element, index) => {
					this.type.validate({ doc, name, value: element });
				});
			}
		}
	}

	resolveValue(plainDoc) {
		let value = super(plainDoc);

		// Do not cast if value is empty.
		if (value === null || value === undefined || !this.class) {
			return value;
		}
		// Cast values.
		let NestedClass = this.class;
		_.each(value, function(element, index) {
			if (!(element instanceof NestedClass)) {
				value[index] = new NestedClass(element);
			}
		});

		return value;
	}
};