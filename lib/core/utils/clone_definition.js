function cloneDefinition(definition) {
	return _.cloneDeepWith(definition, function(value) {
		if (!_.isPlainObject(value) && !_.isArray(value)) {
			return value;
		}
	});
};

export default cloneDefinition;