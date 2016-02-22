function isNestedPattern(fieldPattern) {
	return fieldPattern.indexOf('.') !== -1;
};

export default isNestedPattern;