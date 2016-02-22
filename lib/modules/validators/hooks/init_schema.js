function onInitSchema(schema, className) {
	schema.validators = {};
	schema.resolveError = undefined;
};

export default onInitSchema;