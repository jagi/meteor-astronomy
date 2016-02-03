let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.remove = function(callback) {
	let doc = this;
	let Class = doc.constructor;
	let Collection = Class.getCollection();

	// Wrap callback function.
	let wrappedCallback = Astro.utils.wrapCallback(callback);

	// If we are dealing with a remote collection and we are not on the server.
	if (Collection._connection && Collection._connection !== Meteor.server) {

		// Prepare meteor method name to be called.
		let methodName = '/Astronomy/remove';
		// Prepare arguments for the meteor method.
		let args = [
			Class.getName(), // Class name.
			{ _id: doc._id } // Selector.
		];
		// Prepare meteor method options.
		let options = {
			throwStubExceptions: true,
			returnStubValue: true
		};

		try {
			// Run meteor method.
			let result = Collection._connection.apply(
				methodName, args, options, wrappedCallback
			);
			// Change the "_isNew" flag to "true". After removing a document can be
			// saved again as a new one.
			doc._isNew = true;
			// Return result of the meteor method call.
			return result;
		}
		// Catch stub exceptions.
		catch(error) {
			wrappedCallback(error);
		}

	}
	// If we can just remove a document without calling the meteor method. We may
	// be on the server or the collection may be local.
	else {

		try {
			// Prepare method name.
			let methodName = 'documentRemove';
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
