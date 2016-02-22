function onInitSchema(schema, className) {
	schema.collection = undefined;
	schema.typeField = undefined;
	schema.transform = undefined;
};

export default onInitSchema;