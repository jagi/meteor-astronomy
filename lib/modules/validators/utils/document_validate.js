import castNested from '../../fields/utils/cast_nested.js';
import AstroClass from '../../../core/class.js';
import ObjectField from '../../fields/object_field.js';
import ListField from '../../fields/list_field.js';
import Validators from '../validators.js';
import ValidationError from '../validation_error.js';

function catchValidationError(callback, errors, stopOnFirstError, prefix) {
	try {
		callback();
	}
	catch (err) {
		// If it's ValidationError.
		if (ValidationError.check(err)) {
			// Add pattern if an error comes from the nested field.
			_.each(err.details, (details) => {
				details.pattern = prefix ? prefix + details.name : details.name;
			});

			// If we stop on first error then just throw error again.
			if (stopOnFirstError) {
				throw err;
			}
			// Otherwise we collect errors.
			else {
				_.each(err.details, (details) => {
					errors.push(details);
				});
			}
		}
		// It it's not ValidationError, then we throw error again.
		else {
			throw err;
		}
	}
};

function documentValidate(doc, fieldsNames, stopOnFirstError) {
	let self = this;
	let Class = doc.constructor;

	if (!Match.test(stopOnFirstError, Boolean)) {
		// Get the last argument.
		let element = _.last(arguments);
		if (Match.test(element, Boolean)) {
			stopOnFirstError = element;
		}
		else {
			stopOnFirstError = true;
		}
	}

	if (Match.test(fieldsNames, String)) {
		fieldsNames = [fieldsNames];
	}
	else if (!Match.test(fieldsNames, [String])) {
		fieldsNames = Class.getValidationOrder();
	}

	// Cast nested fields.
	castNested(doc);

	// Prepare array for storing errors list.
	let errors = [];

	_.each(fieldsNames, (name) => {
		let field = Class.getField(name);

		// Move to the next one if a field does not exist.
		if (!field) {
			return;
		}

		// We do not validate transient fields.
		if (field.transient) {
			return;
		}

		// Get value of the field.
		let value = doc.get(name);

		// Execute validation in the try-catch block. That's because we want to
		// continue validation if the "stopOnFirstError" flag is set to false.
		catchValidationError(() => {
			// First, execute type validators.
			field.validate({
				doc,
				name,
				value
			});
			// Get validators for a given field.
			let validators = Class.getValidators(name);
			_.each(validators, ({
				type,
				param,
				resolveParam,
				error,
				resolveError
			}) => {
				// Get validation helper function.
				let validationFunction = Validators[type];
				// Execute single validator.
				validationFunction({
					doc,
					name,
					value,
					param,
					resolveParam,
					error,
					resolveError
				});
			});
		}, errors, stopOnFirstError);

		// If it is the object field then validate it.
		if (field instanceof ObjectField) {
			if (value instanceof AstroClass) {
				catchValidationError(() => {
					documentValidate(value, stopOnFirstError);
				}, errors, stopOnFirstError, field.name + '.');
			}
		}
		// If it is the list field then validate each one.
		else if (field instanceof ListField && field.class) {
			_.each(value, (element, index) => {
				if (element instanceof AstroClass) {
					catchValidationError(() => {
						documentValidate(element, stopOnFirstError);
					}, errors, stopOnFirstError, field.name + '.' + index + '.');
				}
			});
		}
	});

	// If we have not thrown any error yet then it means that there were no errors
	// or we do not throw on the first error.
	if (errors.length > 0) {
		throw new ValidationError(errors, errors[0].error);
	}
};

export default documentValidate;