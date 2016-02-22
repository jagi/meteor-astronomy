import wrapCallback from '../../../core/utils/wrap_callback.js';
import documentValidate from '../utils/document_validate.js';

function validate(fieldsNames, stopOnFirstError, callback) {
	let doc = this;
	let Class = doc.constructor;

	// Check if the "callback" argument is a function.
	if (!Match.test(callback, Function)) {
		// Get the last argument.
		let element = _.last(arguments);
		if (Match.test(element, Function)) {
			callback = element;
		}
	}

	if (!Match.test(stopOnFirstError, Boolean)) {
		// Get one before the last argument.
		let element = _.slice(arguments, -2)[0];
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

	// Wrap callback function.
	let wrappedCallback = wrapCallback(callback);

	// If we are dealing with a remote collection and we are not on the server.
	if (!Meteor.isServer) {

		// Prepare arguments for meteor method.
		let methodName = '/Astronomy/validate';
		let args = [doc, fieldsNames, stopOnFirstError];
		let options = {
			throwStubExceptions: true,
			returnStubValue: true
		};

		try {
			// Run Meteor method.
			Meteor.apply(
				methodName, args, options, wrappedCallback
			);
		}
		// Catch stub exceptions.
		catch (error) {
			wrappedCallback(error);
		}

	}
	// If we can just insert a document without calling the meteor method. We may
	// be on the server or the collection may be local.
	else {

		try {
			// Validate a document.
			return wrappedCallback(
				undefined,
				documentValidate(
					doc, fieldsNames, stopOnFirstError
				)
			);
		}
		catch (error) {
			wrappedCallback(error);
		}

	}
};

export default validate;