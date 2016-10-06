// Class static methods.
import getMethod from '../class_static_methods/get_method.js';
import getMethods from '../class_static_methods/get_methods.js';
import hasMethod from '../class_static_methods/has_method.js';

function onInitClass(Class, className) {
    // Class static methods.
    Class.getMeteorMethod = getMethod;
    Class.getMeteorMethods = getMethods;
    Class.hasMeteorMethod = hasMethod;
};

export default onInitClass;