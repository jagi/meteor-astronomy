// Class static methods.
import getCollection from '../class_static_methods/get_collection.js';
import getTypeField from '../class_static_methods/get_type_field.js';
import getTransform from '../class_static_methods/get_transform.js';

function onInitClass(Class, className) {
	// Class static methods.
	Class.getCollection = getCollection;
	Class.getTypeField = getTypeField;
	Class.getTransform = getTransform;
};

export default onInitClass;