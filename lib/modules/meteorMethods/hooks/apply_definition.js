import _ from 'lodash';

function onApplyDefinition(Class, parsedDefinition, className) {
	let schema = Class.schema;

	// Add methods to the class.
	_.each(parsedDefinition.meteorMethods, (method, methodName) => {
		schema.meteorMethods[methodName] = method;
		Class.prototype[methodName] = method;
	});
};

export default onApplyDefinition;