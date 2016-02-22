// Class static methods.
import getIndex from '../class_static_methods/get_index.js';
import getIndexes from '../class_static_methods/get_indexes.js';
import hasIndex from '../class_static_methods/has_index.js';

function onInitClass(Class, className) {
	// Class static methods.
	Class.getIndex = getIndex;
	Class.getIndexes = getIndexes;
	Class.hasIndex = hasIndex;
};

export default onInitClass;