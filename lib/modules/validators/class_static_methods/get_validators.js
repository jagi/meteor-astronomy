function getValidators(fieldName) {
	let Class = this;

	if (!Match.test(fieldName, Match.Optional(String))) {
		throw TypeError(
			'The first argument of the "getValidators" function has to be a string ' +
			'or left empty'
		);
	}

	if (fieldName) {
		return Class.schema.validators[fieldName];
	}
	else {
		return Class.schema.validators;
	}
};

export default getValidators;