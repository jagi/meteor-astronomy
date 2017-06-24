import toArray from 'lodash/toArray';

function overrideMethod(object, methodName, overridingMethod, param) {
  // Get original method.
  let originalMethod = object[methodName];

  // Override original method.
  object[methodName] = function() {
    // Convert arguments to array.
    let args = toArray(arguments);

    // Execute overriding method passing arguments, original method and extra
    // parameters.
    return overridingMethod.call(this, args, originalMethod, param);
  };
};

export default overrideMethod;