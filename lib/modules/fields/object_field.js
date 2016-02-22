import Field from './field.js';
import Validators from '../validators/validators.js';

class ObjectField extends Field {
	constructor(definition) {
		super(definition);

		this.class = definition.class === undefined ?
			null : definition.class;
	}

	validate(args) {
		super.validate(args);
		let {
			doc,
			name,
			value
		} = args;

		if (this.class && value !== null && value !== undefined) {
			Validators.class({
				doc, name, value, param: this.class
			});
		}
	}

	resolveValue(plainDoc) {
		let value = super.resolveValue(plainDoc);

		// Do not cast if value is empty.
		if (value === null || value === undefined) {
			return value;
		}
		// Cast value.
		let NestedClass = this.class;
		if (!(value instanceof NestedClass)) {
			value = new NestedClass(value);
		}

		return value;
	}
};

export default ObjectField;