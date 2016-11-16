import deprecated from '../../core/utils/deprecated';
// Class static helpers.
import getHelper from '../class_static_methods/getHelper.js';
import getHelpers from '../class_static_methods/getHelpers.js';
import hasHelper from '../class_static_methods/hasHelper.js';

function onInitClass(Class, className) {
  Class.getHelper = getHelper;
  Class.getHelpers = getHelpers;
  Class.hasHelper = hasHelper;
  // Class static helpers.
  Class.getMethod = function(...args) {
    deprecated(
      `Methods have been renamed to helpers. Please use the ` +
      `"${className}.getHelper" function.`
    );
    return this.getHelper.apply(this, args);
  };
  Class.getMethods = function(...args) {
    deprecated(
      `Methods have been renamed to helpers. Please use the ` +
      `"${className}.getHelpers" function.`
    );
    return this.getHelpers.apply(this, args);
  };
  Class.hasMethod = function(...args) {
    deprecated(
      `Methods have been renamed to helpers. Please use the ` +
      `"${className}.hasHelper" function.`
    );
    return this.hasHelper.apply(this, args);
  };
};

export default onInitClass;