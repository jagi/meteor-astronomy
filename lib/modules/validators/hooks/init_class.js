// Class static methods.
import getResolveError from '../class_static_methods/get_resolve_error.js';
import getValidationOrder from '../class_static_methods/get_validation_order.js';
import getValidators from '../class_static_methods/get_validators.js';
// Class prototype methods.
import validate from '../class_prototype_methods/validate.js';

function onInitClass(Class, className) {
	// Class static methods.
	Class.getResolveError = getResolveError;
	Class.getValidationOrder = getValidationOrder;
	Class.getValidators = getValidators;
	// Class prototype methods.
	Class.prototype.validate = validate;
};

export default onInitClass;