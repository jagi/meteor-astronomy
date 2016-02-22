function getValidationOrder() {
	let Class = this;

	// Get all validators.
	let validators = Class.getValidators();
	// Get fields names for defined validators.
	let fieldsNames = Class.getFieldsNames();
	// Make variable name shorter.
	let validationOrder = Class.schema.validationOrder;

	// If there is a validation order provided, then combine fields provided in
	// the validation order with the order of validators.
	if (validationOrder) {
		// Detect what fields are not present in the validation order.
		let diff = _.difference(fieldsNames, validationOrder);
		// Combine validation order with fields that left.
		return validationOrder.concat(diff);
	}
	// If there is no validation order, then just return fields names in the order
	// in which validators were defined.
	else {
		return fieldsNames;
	}
};

export default getValidationOrder;