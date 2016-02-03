let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.save = function(callback) {
	let doc = this;
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Wrap callback function.
	let wrappedCallback = Astro.utils.wrapCallback(callback);
	// Detect which operation we are executing.
	let inserting = doc._isNew;

	// If we are dealing with a remote collection and we are not on the server.
	if (Collection._connection && Collection._connection !== Meteor.server) {

		// Prepare meteor method name to be called.
		let methodName = '/Astronomy/' + (inserting ? 'insert' : 'update');
		// The first argument of the meteor method is a class name.
		let args = [Class.getName()];
		// Inserting.
		if (inserting) {
			// Get raw data from a document and put it as the second argument.
			args.push(
				doc.rawAll(doc, { transient: false }) // Plain document.
			);
		}
		// Updating.
		else {
			args.push(
				{ _id: doc._id }, // Selector.
				{ $set: Astro.utils.storage.getModified(doc) }, // Modifier.
				{} // Options.
			);
			console.log(args);
		}
		// Prepare meteor method options.
		let options = {
			throwStubExceptions: true,
			returnStubValue: true
		};

		try {
			// Run Meteor method.
			let result = Collection._connection.apply(
				methodName, args, options, wrappedCallback
			);
			// In the insert operation a value returned from the method call is a
			// document ID.
			if (inserting) {
				doc._id = result;
			}
			// Document is not new anymore.
			doc._isNew = false;
			// Return result of the meteor method call.
			return result;
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
			// Prepare method name.
			let methodName = 'document' + (inserting ? 'Insert' : 'Update');
			// Prepare arguments.
			let args = [
				doc, // Document.
				true // Trusted.
			];
			return wrappedCallback(
				undefined, Astro.utils.storage[methodName].apply(null, args)
			);
		}
		catch(error) {
			wrappedCallback(error);
		}

	}
};
