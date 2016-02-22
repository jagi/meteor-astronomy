function throwIfSelectorIsNotId(selector, methodName) {
	if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
		throw new Meteor.Error(
			403, 'Not permitted. Untrusted code may only ' + methodName +
			' documents by ID.'
		);
	}
};

export default throwIfSelectorIsNotId;