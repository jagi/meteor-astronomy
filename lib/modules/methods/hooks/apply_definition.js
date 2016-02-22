function onApplyDefinition(Class, parsedDefinition, className) {
	let schema = Class.schema;

	// Add methods to the class.
	_.each(parsedDefinition.methods, (method, methodName) => {
		schema.methods[methodName] = method;
		Class.prototype[methodName] = method;
	});
};

export default onApplyDefinition;