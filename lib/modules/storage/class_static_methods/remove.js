let methods = Astro.Module.modules.storage.classStaticMethods;

methods.remove = function() {
	let Class = this;
	let Collection = Class.getCollection();

	// Get arguments.
	let className = Class.getName();
	let selector = arguments[0];
	let callback = arguments[1];

	// Throw exception if we are trying to remove more than one document at once.
	Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'remove');

	// Prepare arguments.
	let args = [className, selector];

	// Wrap callback function.
	let wrappedCallback = Astro.utils.wrapCallback(callback);

	// If we are dealing with a remote collection and we are not on the server.
	if (Collection._connection && Collection._connection !== Meteor.server) {

		// Prepare arguments for meteor method.
		let methodName = '/Astronomy/classRemove';
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
	// If we can just remove a document without calling the meteor method. We may
	// be on the server or the collection may be local.
	else {

		try {
			// Set the "trusted" argument to true.
			args.push(true);
			// Remove a document.
			return wrappedCallback(
				undefined, Astro.utils.storage.classRemove.apply(null, args)
			);
		} catch(error) {
			wrappedCallback(error);
		}

	}
};