Astro.Module.modules.storage.onApplyDefinition = function(
	Class, parsedDefinition, className
) {
	let schema = Class.schema;

	if (parsedDefinition.collection) {
		let Collection = parsedDefinition.collection;
		schema.collection = Collection;

		Class.extend({
			// Add the "_id" field.
			fields: {
				_id: {
					name: '_id',
					type: String
				}
			},
			// Add storage events.
			events: {
				beforeInit: [Astro.Module.modules.storage.classEvents.beforeInit],
				toJSONValue: [Astro.Module.modules.storage.classEvents.toJSONValue],
				fromJSONValue: [Astro.Module.modules.storage.classEvents.fromJSONValue]
			}
		});

		if (parsedDefinition.typeField) {
			const typeField = schema.typeField = parsedDefinition.typeField;

			const fields = {};
			fields[typeField] = {
				name: typeField,
				type: String
			};
			Class.extend({
				// Add the type field.
				fields: fields,
				events: {
					afterInit: [Astro.Module.modules.storage.classEvents.afterInit]
				}
			});
		}

		// Apply custom transformation function if the transform property is a
		// function.
		if (parsedDefinition.transform instanceof Function) {
			schema.transform = function(attrs) {
				return parsedDefinition.transform(attrs);
			};
		}
		// Apply default transform function if the transform property is undefined.
		else if (parsedDefinition.transform === undefined) {
			schema.transform = Astro.utils.storage.transformToClass(className);
		}

		// Override collection methods.
		let collectionMethods = Astro.Module.modules.storage.collectionMethods;
		_.each(collectionMethods, function(collectionMethod, methodName) {
			if (Collection[methodName]) {
				// If there is a method with the same name already defined in the
				// collection, then override it.
				Astro.utils.core.overrideMethod(
					Collection, methodName, collectionMethod, Class
				);
			}
			else {
				// If there is no method with the given name, then we add one.
				Collection[methodName] = collectionMethod;
			}
		});

		// If it's a remote collection then we register methods on the connection
		// object of the collection.
		if (Collection._connection) {
			// Get connection object.
			let connection = Collection._connection;
			// Get list of the all methods to regiter.
			let meteorMethods = Astro.Module.modules.storage.meteorMethods;
			// Add each meteor method.
			_.each(meteorMethods, function(meteorMethod, methodName) {
				// Check if the given method already exists.
				if (
					// There is a inconsistency between client and server. On the client
					// connection object contains the "_methodHandlers" and on the server
					// the "method_handlers" property.
					(
						connection._methodHandlers &&
						!connection._methodHandlers[methodName]
					) ||
					(
						connection.method_handlers &&
						!connection.method_handlers[methodName]
					)
				) {
					// Add meteor method.
					connection.methods(_.zipObject([methodName], [meteorMethod]));
				}
			});
		}

		// Add methods to the class prototype only if there is a collection defined
		// for the given class.
		_.extend(
			Class.prototype, Astro.Module.modules.storage.classPrototypeMethods
		);
	}
};