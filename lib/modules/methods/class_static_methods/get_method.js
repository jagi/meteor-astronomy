function getMethod(methodName) {
	return this.schema.methods[methodName];
};

export default getMethod;