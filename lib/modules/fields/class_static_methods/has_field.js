function hasField(fieldName) {
	return _.has(this.schema.fields, fieldName);
};

export default hasField;