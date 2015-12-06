Astro.utils = {};

Astro.utils.warn = function(warning) {
  if (console && console.warn && Astro.config.verbose) {
    console.warn(warning);
  }
};

Astro.utils.overrideMethod = function(
  object, methodName, overridingMethod, param
) {
  // Get original method.
  let originalMethod = object[methodName];

  // Override original method.
  object[methodName] = function() {
    // Convert arguments to array.
    let args = _.toArray(arguments);

    // Execute overriding method passing arguments, original method and extra
    // parameters.
    return overridingMethod.call(this, args, originalMethod, param);
  };
};