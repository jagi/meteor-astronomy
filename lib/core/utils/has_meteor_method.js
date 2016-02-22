function hasMeteorMethod(connection, methodName) {
	// There is inconsistency between client and server. On the client connection
	// object contains the "_methodHandlers" property and on the server the
	// "method_handlers" property.
	let methodHandlers = connection._methodHandlers || connection.method_handlers;

	return _.has(methodHandlers, methodName);
};

export default hasMeteorMethod;