var checks = {};

checks.moduleDefinition = function(moduleDefinition) {
  // Check parameters validity.
  if (!_.isObject(moduleDefinition)) {
    throw new Error('The module definition has to be an object');
  }

  // Check if module name is provided.
  if (!_.has(moduleDefinition, 'name')) {
    throw new Error('The module name has to be provided');
  }

  // Check if module name is a string.
  if (!_.isString(moduleDefinition.name)) {
    throw new Error('The module name has to be a string');
  }

  // Check if module with given name already exists.
  if (_.has(Astro.modules, moduleDefinition.name)) {
    throw new Error(
      'The module with the name "' + moduleDefinition.name +
      '" is already defined'
    );
  }
}

Astro.createModule = function(moduleDefinition) {
  // Check validity of the module definition.
  checks.moduleDefinition(moduleDefinition);

  // Initialize a module if the "init" method had been defined.
  if (_.isFunction(moduleDefinition.init)) {
    moduleDefinition.init();
  }

  // Add module events to global events list.
  if (_.has(moduleDefinition, 'events')) {
    _.each(moduleDefinition.events, function(eventHandler, eventName) {
      Astro.on(eventName, eventHandler);
    });
  }

  // Add the module definition to the global list of modules.
  return Astro.modules[moduleDefinition.name] = moduleDefinition;
};
