// Class static methods.
import getMeteorMethod from '../class_static_methods/getMeteorMethod.js';
import getMeteorMethods from '../class_static_methods/getMeteorMethods.js';
import hasMeteorMethod from '../class_static_methods/hasMeteorMethod.js';

function onInitClass(Class, className) {
  // Class static methods.
  Class.getMeteorMethod = getMeteorMethod;
  Class.getMeteorMethods = getMeteorMethods;
  Class.hasMeteorMethod = hasMeteorMethod;
};

export default onInitClass;