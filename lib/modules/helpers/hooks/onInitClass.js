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
    console.warn(
      `Deprecation warning: methods have been renamed to helpers, please ` +
      `use the "${className}.getHelper" function instead.`
    );
    this.getHelper.apply(this, args);
  };
  Class.getMethods = function(...args) {
    console.warn(
      `Deprecation warning: methods have been renamed to helpers, please ` +
      `use the "${className}.getHelpers" function instead.`
    );
    this.getHelpers.apply(this, args);
  };
  Class.hasMethod = function(...args) {
    console.warn(
      `Deprecation warning: methods have been renamed to helpers, please ` +
      `use the "${className}.hasHelper" function instead.`
    );
    this.hasHelper.apply(this, args);
  };
};

export default onInitClass;