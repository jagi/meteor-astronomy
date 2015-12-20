Astro.Module.modules.methods.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "methods" property.
  if (_.has(definition, 'methods')) {
    parsedDefinition.methods = {};

    if (!Match.test(definition.methods, Object)) {
      Astro.utils.core.throwParseError([
        {class: className}, {property: 'methods'},
        'The methods definition has to be an object'
      ]);
    }

    _.each(definition.methods, function(method, methodName) {
      if (!Match.test(method, Function)) {
        Astro.utils.core.throwParseError([
          {class: className}, {method: methodName},
          'Method has to be a function'
        ]);
      }

      parsedDefinition.methods[methodName] = method;
    });
  }

  return parsedDefinition;
};
