function getMethod(methodName) {
	return this.schema.meteorMethods[methodName];
};

export default getMethod;