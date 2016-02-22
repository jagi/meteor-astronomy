function hasMethod(methodName) {
	return _.has(this.schema.methods, methodName);
};

export default hasMethod;