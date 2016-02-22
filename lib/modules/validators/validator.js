import ValidationError from './validation_error.js';
import Validators from './validators.js';

class Validator {
	constructor(definition) {
		this.name = definition.name;
		this.parseParam = definition.parseParam;
		this.isValid = definition.isValid;
		this.resolveError = definition.resolveError;
	}

	static create(definition) {
		let validator = new this(definition);
		this.validators[validator.name] = validator;

		// Create validation function that takes validator, some params and performs
		// validation.
		let Validator = Validators[validator.name] = function({
			doc,
			name,
			value,
			param,
			resolveParam,
			error,
			resolveError
		}) {
			// Resolve param is the "resolveParam" function is provided.
			if (resolveParam instanceof Function) {
				param = resolveParam({
					doc,
					name,
					value
				});
			}
			// Parse param type if validator has parsing function.
			if (validator.parseParam instanceof Function) {
				validator.parseParam(param);
			}
			// Prepare data for validation.
			let args = {
				doc,
				name,
				value,
				param
			};

			// Perform validation.
			if (!validator.isValid(args)) {
				// Prepare function for throwing validation error.
				let throwError = function(error) {
					// Throw error only if the error message has been successfully
					// generated.
					if (!error) {
						return;
					}
					// Throw error.
					throw new ValidationError([{
						type: validator.name,
						name,
						value,
						param,
						error
					}], error);
				};

				// Generate error message using the "resolveError" function if provided.
				if (resolveError instanceof Function) {
					throwError(resolveError(args));
				}

				// Get error message from the string if provided.
				if (typeof error === 'string') {
					throwError(error);
				}

				// Get error by executing a class level "resolveError" function.
				let Class = doc.constructor;
				let classResolveError = Class.getResolveError();
				if (classResolveError instanceof Function) {
					throwError(classResolveError(args));
				}

				// Get default error message.
				if (validator.resolveError instanceof Function) {
					throwError(validator.resolveError(args));
				}

				throwError(ValidationError.DEFAULT_REASON);
			}
		};

		return Validator;
	}
};

Validator.validators = {};

export default Validator;