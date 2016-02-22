import Validators from '../validators/validators.js';

class Field {
	constructor(definition) {
		definition = definition || {};

		this.name = definition.name;
		this.default = definition.default === undefined ?
			null : definition.default;
		this.optional = definition.optional === undefined ?
			false : definition.optional;
		this.immutable = definition.immutable === undefined ?
			false : definition.immutable;
		this.transient = definition.transient === undefined ?
			false : definition.transient;
		this.resolve = definition.resolve === undefined ?
			null : definition.resolve;
	}

	getDefault() {
		if (_.isFunction(this.default)) {
			return this.default();
		}
		else if (_.isNull(this.default)) {
			return null;
		}
		return this.default;
	}

	validate(args) {
		// If a field is not optional (required) then it has to have value.
		if (!this.optional) {
			Validators.required(args);
		}
	}

	resolveValue(plainDoc) {
		let value;
		if (this.resolve) {
			value = this.resolve(plainDoc);
		}
		else {
			value = plainDoc[this.name];
		}
		if (value === undefined) {
			value = this.getDefault();
		}
		return value;
	}
};

export default Field;