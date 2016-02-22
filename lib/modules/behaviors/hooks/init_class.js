import getBehavior from '../class_static_methods/get_behavior.js';
import getBehaviors from '../class_static_methods/get_behaviors.js';
import hasBehavior from '../class_static_methods/has_behavior.js';

function onInitClass(Class, className) {
	Class.getBehavior = getBehavior;
	Class.getBehaviors = getBehaviors;
	Class.hasBehavior = hasBehavior;
};

export default onInitClass;