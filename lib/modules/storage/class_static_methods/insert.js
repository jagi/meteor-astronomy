let methods = Astro.Module.modules.storage.classStaticMethods;

methods.insert = function(plainDoc, callback) {
	let Class = this;
	let Collection = Class.getCollection();

	// Prepare arguments.
	let args = [
		Class.getName(),
		plainDoc
	];
	// Wrap callback function.
	let wrappedCallback = Astro.utils.core.wrapCallback(callback);

	// If we are dealing with a remote collection and we are not on the server.
	if (Collection._connection && Collection._connection !== Meteor.server) {

		// Prepare meteor method name to be called.
		let methodName = '/Astronomy/insert';
		// Prepare meteor method options.
		let options = {
			throwStubExceptions: true,
			returnStubValue: true
		};

		try {
			// Run Meteor method.
			return Collection._connection.apply(
				methodName, args, options, wrappedCallback
			);
		}
		// Catch stub exceptions.
		catch(error) {
			wrappedCallback(error);
		}

	}
	// If we can just insert a document without calling the meteor method. We may
	// be on the server or the collection may be local.
	else {

		try {
			// Set the "trusted" argument to true.
			args.push(true);
			// Insert a document.
			return wrappedCallback(
				undefined,
				Astro.utils.storage.classInsert.apply(Astro.utils.storage, args)
			);
		}
		catch(error) {
			wrappedCallback(error);
		}

	}
};